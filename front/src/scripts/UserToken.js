import localforage from 'localforage';

const getDownloadToken = async () => {
    return localforage.getItem('download-token')
        .then((downloadToken) => {
            if (downloadToken === null) {
                // token doesn't exist in local storage, create it
                downloadToken = "";
                localforage.setItem('download-token', downloadToken);
            }
            return downloadToken;
        })
        .catch((error) => {
            console.error(`Error while loading download token : ${error}`);
        });
}

const setDownloadToken = async (item) => {
    return localforage.setItem('download-token', item)
        .then(() => true)
        .catch((error) => {
            console.error(`Error while saving token : ${error}`);
        });
}

export {getDownloadToken, setDownloadToken};