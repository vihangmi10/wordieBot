import reqBot from './requestBot';

const nextPage = async () => {
    let options = {
        endpoint: 'move-to-next-page',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }

};

const prevPage = async () => {
    let options = {
        endpoint: 'move-to-previous-page',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const firstPage = async () => {
    let options = {
        endpoint: 'jump-to-first-page',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const lastPage = async () => {
    let options = {
        endpoint: 'jump-to-last-page',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

export default {
    nextPage: nextPage,
    prevPage: prevPage,
    firstPage: firstPage,
    lastPage: lastPage
};