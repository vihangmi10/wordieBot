import reqBot from './requestBot';

const nextPage = async () => {
    let endpoint = 'move-to-next-page';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }

};

const prevPage = async () => {
    let endpoint = 'move-to-previous-page';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const firstPage = async () => {
    let endpoint = 'jump-to-first-page';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const lastPage = async () => {
    let endpoint = 'jump-to-last-page';
    try{
        return await reqBot(endpoint);
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