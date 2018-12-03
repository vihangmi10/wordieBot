import reqBot from './requestBot';

const nextTerm = async () => {
    let endpoint = 'move-to-next-term';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const prevTerm = async () => {
    let endpoint = 'move-to-previous-term';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const firstTerm = async () => {
    let endpoint = 'jump-to-first-term';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }

};

const lastTerm = async () => {
    let endpoint = 'jump-to-last-term';
    try{
        return await reqBot(endpoint);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

export default {
    nextTerm: nextTerm,
    prevTerm: prevTerm,
    firstTerm: firstTerm,
    lastTerm: lastTerm
};

