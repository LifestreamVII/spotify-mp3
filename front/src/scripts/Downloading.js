import axios from 'axios';

const downloadFromURL = async (url) => {
    const apiUrl = `/api/download/track/${url}`
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (err) {
        throw Error(err.response.data);
    }
}

const getStatus = async (url) => {
    const apiUrl = `/api/download${url}`
    try {
        const response = await axios.get(apiUrl);
        if (response.data.state)
            return response.data;
        else
            throw new Error("Some error while fetching status");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const blobDL = (data, name="file.mp3") => {
    try {

        const blob = new Blob([data], { type: 'audio/mpeg' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error:', error);
    }
}

export {downloadFromURL, getStatus, blobDL};
