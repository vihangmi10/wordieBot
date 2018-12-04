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
        // Reset the bot to look at the first word of a new page.
        let status = await getBotStatus();
        let jsonStatus = JSON.parse(status);
        if (jsonStatus.hasPreviousTerm) {
            await botCameraAction.firstTerm();
        }
        // If the word is less than M start lookup from beginning else start lookup from end.
        if (wordToFind.charAt(0) < 'M') {
            currentPage =  await botArmAction.firstPage();
            currentPageJson = JSON.parse(currentPage);
            // Till there is next page.
            while (currentPageJson.hasNextPage) {
                currentWord = currentPageJson.currentTerm;
                currentTermDefinition = currentPageJson.currentTermDefinition;
                // Till there is next word on that page.
                while(currentPageJson.hasNextTerm) {
                    // if the word is found return the object.
                    if (currentWord === wordToFind) {
                        return termResponse = {
                            currentWord: currentWord,
                            currentTermDefinition: currentTermDefinition
                        };
                    }
                    // Else select the next term.
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
            // turn page backwards till the first page.
            while (currentPageJson.hasPreviousPage){
                currentWord = currentPageJson.currentTerm;
                currentTermDefinition = currentPageJson.currentTermDefinition;
                // Till last word on that page.
                while (currentPageJson.hasNextTerm) {
                    // if word is found return the word
                   if (currentWord === wordToFind) {
                       return termResponse ={
                           currentWord: currentWord,
                           currentTermDefinition: currentTermDefinition
                       };
                   } else {
                       // Select the next word and repeat.
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
        return "Word not found";

    } catch (e) {
        console.log('Error getting status...');
    }

};

export default findWord;