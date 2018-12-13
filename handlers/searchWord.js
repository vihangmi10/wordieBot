import botArmAction from '../utils/botArmActions';
import botCameraAction from '../utils/botCameraActions';

let dictionary = new Map();

// Compare each character of the first word and word to find and word to find and last word.
// If the character is same move ahead. If the character is different and if the word to find character is between the first word and last word
// return true if the word is between first word and last word.
const characterComparator = (word1, word2, position) =>{
    if (position === Math.max(word1.length, word2.length)) {
        return true;
    }
    let firstCharacter = word1.length > position ? word1.charAt(position) : ' ';
    let secondCharacter = word2.length > position ? word2.charAt(position) : ' ';

    if ((secondCharacter === firstCharacter)){
        return characterComparator(word1, word2, position+1);
    }
    else return (secondCharacter > firstCharacter);
};
// A function to check if the word to find is closer to the first word or the last word.
// if the character that is different in word to find then first word and last word then compare it with first word character and last word character
// Check to which word it is closer
// Return true if it is closer to first word else return false.

const startLookupFromFirst = (firstWord, lastWord, word, position) => {

    if (position === word.length) {
        return true;
    }
    let firstCharacter = firstWord.currentTerm.length > position ? firstWord.currentTerm.charCodeAt(position) : 'A'.charCodeAt(0);
    let lastCharacter = lastWord.currentTerm.length > position ? lastWord.currentTerm.charCodeAt(position) : 'Z'.charCodeAt(0);
    if ( (word.charCodeAt(position) - firstCharacter) < (lastCharacter - word.charCodeAt(position)) ){
        return true;
    } else if ((word.charCodeAt(position) - firstCharacter) > (lastCharacter - word.charCodeAt(position))) {
        return false;
    }else {
        return startLookupFromFirst(firstWord, lastWord, word, position+1);
    }
};

const findWord = async (req) => {
    let wordToFind;
    let currentPage;
    let currentPageJson;
    let lastWord;
    let lastWordJson;
    let firstWord;
    let firstWordJson;
    let currentWord;
    let currentWordJson;

      if (!req.query.term)
          throw new Error('Invalid query parameter');
      wordToFind = req.query.term.toUpperCase();
      console.log('Word to find is ---- ', wordToFind);
      console.log('Is it in dictionary.... ', dictionary.has(wordToFind));
      // Check if the word is in the dictionary.
    if (dictionary.has(wordToFind)) {
        console.log('Word found in the dictionary....');
        let wordMeaning = dictionary.get(wordToFind);
        console.log('Returning the word --- '+wordToFind+ ' and its meaning ---- ', wordMeaning);
        return {word: wordToFind, meaning: wordMeaning};
    }
    else {
        if (wordToFind.charAt(0) < 'M') {
            // Search from start
            currentPage = await botArmAction.firstPage();
            currentPageJson = JSON.parse(currentPage);

            // get the last word of the page
            lastWord = await botCameraAction.lastTerm();
            lastWordJson = JSON.parse(lastWord);

            // set the bot camera to look at the first word
            firstWord = await botCameraAction.firstTerm();
            firstWordJson = JSON.parse(firstWord);

            // flip pages till the last page
            while(currentPageJson.hasNextPage) {
                let position = 0;
                if (currentPageJson.currentTerm.charAt(0) > wordToFind.charAt(0)) {
                    return {message: 'Word not found'};
                }
                if (characterComparator(firstWordJson.currentTerm, wordToFind, position) && characterComparator(wordToFind, lastWordJson.currentTerm, position)) {
                    // Word is on this page
                    if (startLookupFromFirst(firstWordJson, lastWordJson, wordToFind, 0)) {
                        // start the search from first word
                        currentWord = await botCameraAction.firstTerm();
                        currentWordJson = JSON.parse(currentWord);
                        while (currentWordJson.hasNextTerm) {
                            if (currentWordJson.currentTerm === wordToFind){
                                console.log('WORD FOUND 1 --- ', +wordToFind+ ' Meaning ---- ', currentWordJson.currentTermDefinition);
                                console.log('Adding word to dictionary...');
                                dictionary.set(wordToFind, currentWordJson.currentTermDefinition);
                                console.log('The dictionary is ---- ', dictionary);
                                return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) === wordToFind.charAt(0)) && (currentWordJson.currentTerm.charAt(1)) > wordToFind.charAt(1)) {
                                return {message: 'Word not found'};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) !== wordToFind.charAt(0) && (currentWordJson.currentTerm.charAt(0) > wordToFind.charAt(0)))) {
                                return {message: 'Word not found'};
                            }
                            currentWord = await botCameraAction.nextTerm();
                            currentWordJson = JSON.parse(currentWord);
                        }
                        return {message: 'Word not found'};
                    }else {
                        // start the search from the last word.
                        currentWord = await botCameraAction.lastTerm();
                        currentWordJson = JSON.parse(currentWord);
                        while (currentWordJson.hasPreviousTerm) {
                            if (currentWordJson.currentTerm === wordToFind) {
                                console.log('WORD FOUND 2--- ', +currentWordJson.currentTerm+ ' Meaning ---- ', currentWordJson.currentTermDefinition);
                                console.log('Adding the word to dictionary....');
                                dictionary.set(wordToFind, currentWordJson.currentTermDefinition);
                                console.log('Dictionary is ---- ', dictionary);
                                return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) === wordToFind.charAt(0)) && (currentWordJson.currentTerm.charAt(1)) < wordToFind.charAt(1)) {
                                return {message: 'Word not found'};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) !== wordToFind.charAt(0) && (currentWordJson.currentTerm.charAt(0) < wordToFind.charAt(0)))) {
                                return {message: 'Word not found'};
                            }
                            currentWord = await botCameraAction.prevTerm();
                            currentWordJson = JSON.parse(currentWord);
                        }
                        return {message: 'Word not found'};
                    }
                } else {
                    // increment the page
                    currentPage = await botArmAction.nextPage();
                    currentPageJson =  JSON.parse(currentPage);
                    firstWord = await botCameraAction.firstTerm();
                    firstWordJson = JSON.parse(firstWord);
                    lastWord = await botCameraAction.lastTerm();
                    lastWordJson = JSON.parse(lastWord);

                }
            }
        } else {
            console.log('Start from the back...');
            // Search from start
            currentPage = await botArmAction.lastPage();
            currentPageJson = JSON.parse(currentPage);

            // get the last word of the page
            lastWord = await botCameraAction.lastTerm();
            lastWordJson = JSON.parse(lastWord);

            // set the bot camera to look at the first word
            firstWord = await botCameraAction.firstTerm();
            firstWordJson = JSON.parse(firstWord);

            while (currentPageJson.hasPreviousPage) {
                let position = 0;
                if (currentPageJson.currentTerm.charAt(0) < wordToFind.charAt(0)) {
                    return {message: 'Word not found'};
                }
                if (characterComparator(firstWordJson.currentTerm, wordToFind, position) && characterComparator(wordToFind, lastWordJson.currentTerm, position)) {
                    // Word is on this page
                    if (startLookupFromFirst(firstWordJson, lastWordJson, wordToFind, 0)) {
                        // start the search from first word
                        currentWordJson = firstWordJson;
                        while (currentWordJson.hasNextTerm) {
                            if (currentWordJson.currentTerm === wordToFind){
                                console.log('WORD FOUND 3--- ', +wordToFind+ ' Meaning ---- ', currentWordJson.currentTermDefinition);
                                dictionary.set(wordToFind, currentWordJson.currentTermDefinition);
                                return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) === wordToFind.charAt(0)) && (currentWordJson.currentTerm.charAt(1)) > wordToFind.charAt(1)) {
                                return {message: 'Word not found'};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) !== wordToFind.charAt(0) && (currentWordJson.currentTerm.charAt(0) > wordToFind.charAt(0)))) {
                                return {message: 'Word not found'};
                            }
                            currentWord = await botCameraAction.nextTerm();
                            currentWordJson = JSON.parse(currentWord);
                        }
                        return {message: 'Word not found'};

                    }else {
                        // start the search from the last word.
                        currentWord = await botCameraAction.lastTerm();
                        currentWordJson = JSON.parse(currentWord);
                        while (currentWordJson.hasPreviousTerm) {
                            if (currentWordJson.currentTerm === wordToFind) {
                                console.log('Word found and it is 4 --- ' +currentWordJson.currentTerm+ ' and the meaning is ----- ', currentWordJson.currentTermDefinition);
                                dictionary.set(wordToFind, currentWordJson.currentTermDefinition);
                                return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) === wordToFind.charAt(0)) && (currentWordJson.currentTerm.charAt(1)) < wordToFind.charAt(1)) {
                                return {message: 'Word not found'};
                            }
                            if ((currentWordJson.currentTerm.charAt(0) !== wordToFind.charAt(0) && (currentWordJson.currentTerm.charAt(0) < wordToFind.charAt(0)))) {
                                return {message: 'Word not found'};
                            }
                            currentWord = await botCameraAction.prevTerm();
                            currentWordJson = JSON.parse(currentWord);
                        }
                        return {message: 'Word not found'};
                    }
                } else {
                    // increment the page
                    currentPage = await botArmAction.prevPage();
                    currentPageJson = JSON.parse(currentPage);
                    firstWord = await botCameraAction.firstTerm();
                    firstWordJson = JSON.parse(firstWord);
                    lastWord = await botCameraAction.lastTerm();
                    lastWordJson = JSON.parse(lastWord);

                }
            }

        }
    }

};

export default findWord;