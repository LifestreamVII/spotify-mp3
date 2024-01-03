# mp3api.py
from flask import Flask, request, jsonify, url_for, send_file
from celery import Celery
import hashlib
import subprocess
import json
import time
import re
import redis
import secrets

# Create a Redis client
redis_client = redis.Redis(host='redis', port=6379, db=0)

# create a Flask instance
app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://redis:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task(bind=True)
def long_task(self, url):
    url_full = "https://www.deezer.com/us/track/" + url
    proc = subprocess.Popen(["deemix", "--bitrate", "320", url_full], stdout=subprocess.PIPE)
    line = 'e'
    while True:
     if not line:
      break
     line = proc.stdout.readline().decode('utf-8')
     if "%" in str(line):
      perc = int(re.findall('\d*%', line)[0].replace('%', '')) / 100
     else:
      perc = 0
     self.update_state(state='PROGRESS',
                          meta={'current': perc, 'status': line})
    # Generate a unique token
    token = secrets.token_urlsafe(16)
    # Set an expiration time for the token (e.g., 24 hours)
    # Set the token as a key in Redis with the MP3 file as its value
    file_path = f"/usr/src/music/data/{url}_dl.mp3"
    redis_client.set(token, file_path)
    redis_client.expire(token, 24 * 60 * 60)
    self.update_state(state='SUCCESS',
                    meta={'current': 100, 'status': 'Task completed!', 'token': token})
    return True

# requires user integer argument: value
# returns error message if wrong arguments are passed.
@app.route('/api', methods=['GET', 'POST'])
def square():
    if not all(k in request.args for k in (["value"])):
        error_message =     f"\
                            Required paremeters : 'value'<br>\
                            Supplied paremeters : {[k for k in request.args]}\
                            "
        return error_message
    else:
        url = request.args.get('value')
        task = long_task.apply_async(args=[url])
        return jsonify(statusUrl=url_for('taskstatus', task_id=task.id)), 202

@app.route('/api/download', methods=['GET'])
def apidl():
    # Generate a unique token

    if not all(k in request.args for k in ["song", "token", "key"]):
        error_message = f"\
            Required parameters: 'song', 'token', 'key'<br>\
            Supplied parameters: {[k for k in request.args]}\
        "
        return error_message
    else:
        song = request.args.get('song')
        key = request.args.get('key')
        token = request.args.get('token')

        # Calculate SHA256 hash of the appended 'song' argument with key
        hashed_s = hashlib.sha256(f"{song}youripodsmells".encode()).hexdigest()
        if hashed_s == key:
            # Proceed with the task execution
                # Validate the token and check its validity (e.g., expiry)
            if token_validity(token):
                # Generate the actual download link using a unique route
                download_link = f"http://192.168.8.30:3070/download/{token}"
                return jsonify(url=download_link), 200
            else:
            #   Handle invalid or expired token
                return jsonify(
                        {"message": "invalid or expired token"}
                    ), 401
        else:
            return jsonify(
                    {"message": "invalid key"}
                ), 401

@app.route("/download/<token>")
def download_file(token):
    # Validate the token and check its validity (e.g., expiry)
    if token_validity(token):
        # Get the associated file path from the token
        file_path = get_file_path_from_token(token)
        # Serve the MP3 file to the client
        return send_file(file_path, as_attachment=True, download_name="file.mp3")
    else:
        # Handle invalid or expired token
        return jsonify(
                    {"message": "invalid or expired token"}
                ), 401

def token_validity(token):
    print(token)
    # Check if the token exists in Redis
    if redis_client.exists(token):
        # Check the expiration time of the token
        expiration_time = redis_client.ttl(token)
        if expiration_time > 0:
            # Token is valid and not expired
            return True
    return False

def get_file_path_from_token(token):
    # Retrieve the file path associated with the token from Redis
    return redis_client.get(token).decode("utf-8")

def delete_token(token):
    # Delete the token from Redis
    redis_client.delete(token)

@app.route('/status/<task_id>')
def taskstatus(task_id):
    task = long_task.AsyncResult(task_id)
    if task.state == 'PENDING':
        # job did not start yet
        response = {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state == 'PROGRESS':
        # job in progress
        response = {
            'state': task.state,
            'current': task.info.get('current', ''),
            'total': 1,
            'status': task.info.get('status', '')
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
        if 'token' in task.info:
            response['token'] = task.info['token']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info)  #this is the exception raised
	}
    return jsonify(response)

if __name__ == "__main__":
	app.run(host='0.0.0.0',port=5000)
	# for debug
	#app.run(debug=True, host='0.0.0.0', port=5000)
