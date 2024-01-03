import { type } from '@testing-library/user-event/dist/type';
import localforage from 'localforage';

const getUserHistory = () => {
    return localforage.getItem('user-history')
        .then((userHistory) => {
            if (userHistory === null) {
                // user-history doesn't exist in local storage, create it
                userHistory = [];
                localforage.setItem('user-history', userHistory);
            }
            return userHistory;
        })
        .catch((error) => {
            console.error(`Error while loading user history: ${error}`);
        });
}

const setUserHistory = (item) => {
    return getUserHistory().then((h)=>{
        let history;
        if (typeof h === "string") history = JSON.parse(h);
        else if (h) history = h;
        return localforage.setItem('user-history', [...history, item])
        .then(()=>true)
        .catch((error) => {
            console.error(`Error while saving user history: ${error}`);
        });
    })
}

export {getUserHistory, setUserHistory};