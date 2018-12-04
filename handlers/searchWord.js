import botArmAction from '../utils/botArmActions';
import botCameraAction from '../utils/botCameraActions';
import getBotStatus from '../handlers/statusHandler';

const findWord = async (req) => {
    let termResponse = {};
    let firstTerm;
    let lastTerm;
    let currentTerm;
    let currentWord;
    let currentTermDefinition;
    let currentPage;
    let currentPageJson;
    let currentTermJson;
    let wordToFind = req.query.term.toUpperCase();
    try {
        let status = await getBotStatus();
        let jsonStatus = JSON.parse(status);
        if (jsonStatus.hasPreviousTerm) {
            await botCameraAction.firstTerm();
        }
        if (wordToFind.charAt(0) < 'M') {
            currentPage =  await botArmAction.firstPage();
            currentPageJson = JSON.parse(currentPage);
            while (currentPageJson.hasNextPage) {
                currentWord = currentPageJson.currentTerm;
                currentTermDefinition = currentPageJson.currentTermDefinition;
                while(currentPageJson.hasNextTerm) {
                    if (currentWord === wordToFind) {
                        return termResponse = {
                            currentWord: currentWord,
                            currentTermDefinition: currentTermDefinition
                        };
                    }
                    currentTerm = await botCameraAction.nextTerm();
                    currentTermJson = JSON.parse(currentTerm);
                    currentWord = currentTermJson.currentTerm;
                    currentTermDefinition = currentTermJson.currentTermDefinition;
                }
                currentPage = await botArmAction.nextPage();
                currentPageJson = JSON.parse(currentPage);
            }
        } else {
            currentPage = await botArmAction.lastPage();
            currentPageJson = JSON.parse(currentPage);
            while (currentPageJson.hasPreviousPage){
                currentWord = currentPageJson.currentTerm;
                currentTermDefinition = currentPageJson.currentTermDefinition;
                while (currentPageJson.hasNextTerm) {
                   if (currentWord === wordToFind) {
                       return termResponse ={
                           currentWord: currentWord,
                           currentTermDefinition: currentTermDefinition
                       };
                   } else {
                       currentTerm = await botCameraAction.nextTerm();
                       currentTermJson = JSON.parse(currentTerm);
                       currentWord = currentTermJson.currentTerm;
                       currentTermDefinition = currentTermJson.currentTermDefinition;
                   }
                }
                currentPage = await botArmAction.prevPage();
                currentPageJson = JSON.parse(currentPage);
            }


        }
        return currentPage;

    } catch (e) {
        console.log('Error getting status...');
    }

};

export default findWord;