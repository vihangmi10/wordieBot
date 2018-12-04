import reqBot from './requestBot';

const nextTerm = async () => {
    let options = {
        endpoint: 'move-to-next-term',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const prevTerm = async () => {
    let options = {
        endpoint: 'move-to-previous-term',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }
};

const firstTerm = async () => {
    let options = {
        endpoint: 'jump-to-first-term',
        method: 'POST'
    };
    try{
        return await reqBot(options);
    }catch (e) {
        console.log('Error ---- ', e);
    }

};

const lastTerm = async () => {
    let options = {
        endpoint: 'jump-to-last-term',
        method: 'POST'
    };
    try{
        return await reqBot(options);
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

