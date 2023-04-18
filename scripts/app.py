# mp3api.py
from flask import Flask, request, jsonify, url_for
from celery import Celery
import subprocess
import json
import time
import re

# create a Flask instance
app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://redis:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task(bind=True)
def long_task(self, url):
    url = "https://www.deezer.com/us/track/" + url
    proc = subprocess.Popen(["deemix", "--bitrate", "320", url], stdout=subprocess.PIPE)
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
    return {'current': 100, 'total': 100, 'status': 'Task completed!',
            'result': 42}

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
        if 'result' in task.info:
            response['result'] = task.info['result']
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
