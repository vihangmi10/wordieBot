import botArmAction from '../utils/botArmActions';
import botCameraAction from '../utils/botCameraActions';

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
const someFunction = async (req) => {

    let firstWord = {
        currentTerm: 'YESTERDAY'
    };
    let lastWord = {
        currentTerm: 'YOGURT'
    };
    let word = 'YES';
    let position = 0;
    console.log(characterComparator(firstWord,lastWord, word, position));
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
      console.log('WORD TO BE FOUND ---- ', wordToFind);
      console.log(wordToFind.charAt(0));

      if (wordToFind.charAt(0) <= 'M') {
          console.log('Start from start...');
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
              if (characterComparator(firstWordJson.currentTerm, wordToFind, position) && characterComparator(wordToFind, lastWordJson.currentTerm, position)) {
                  console.log('Word is on this page between....');
                  console.log('First word -- ', firstWordJson);
                  console.log(' Last word --- ', lastWordJson);
                  // Word is on this page
                  if (startLookupFromFirst(firstWordJson, lastWordJson, wordToFind, 0)) {
                      // start the search from first word
                      console.log('It should start from first ...');
                      currentWordJson = firstWordJson;
                      while (currentWordJson.hasNextTerm) {
                          if (currentWordJson.currentTerm === wordToFind){
                              return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                          }
                          currentWord = await botCameraAction.nextTerm();
                          currentWordJson = JSON.parse(currentWord);
                      }
                      return {message: 'Word not found'};
                  }else {
                      // start the search from the last word.
                      console.log('It should start from last...');
                      currentWordJson = lastWordJson;
                      console.log('CURRENT WORD JSON --- ', currentWordJson);
                      while (currentWordJson.hasPreviousTerm) {
                          console.log('Does it have previous term???? --- ', currentWordJson);
                          if (currentWordJson.currentTerm === wordToFind) {
                              return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                          }
                          currentWord = await botCameraAction.prevTerm();
                          console.log('GOING TO PREVIOUS TERM ---- ', currentWord);
                          currentWordJson = JSON.parse(currentWord);
                      }
                      return {message: 'Word not found'};
                  }
              } else {
                  // increment the page
                  currentPage = await botArmAction.nextPage();
                  currentWordJson = JSON.parse(currentPage);
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
              if (characterComparator(firstWordJson.currentTerm, wordToFind, position) && characterComparator(wordToFind, lastWordJson.currentTerm, position)) {
                  console.log('Word is on this page between....');
                  console.log('First word -- ', firstWordJson);
                  console.log(' Last word --- ', lastWordJson);
                  // Word is on this page
                  if (startLookupFromFirst(firstWordJson, lastWordJson, wordToFind, 0)) {
                      // start the search from first word
                      console.log('It should start from first ...');
                      currentWordJson = firstWordJson;
                      while (currentWordJson.hasNextTerm) {
                          if (currentWordJson.currentTerm === wordToFind){
                              return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                          }
                          currentWord = await botCameraAction.nextTerm();
                          currentWordJson = JSON.parse(currentWord);
                      }
                      return {message: 'Word not found'};

                  }else {
                      // start the search from the last word.
                      console.log('It should start from last...');
                      currentWordJson = lastWordJson;
                      while (currentWordJson.hasPreviousTerm) {
                          if (currentWordJson.currentTerm === wordToFind) {
                              return {word: currentWordJson.currentTerm, meaning: currentWordJson.currentTermDefinition};
                          }
                          currentWord = await botCameraAction.prevTerm();
                          currentWordJson = JSON.parse(currentWord);
                      }
                      return {message: 'Word not found'};
                  }
              } else {
                  // increment the page
                  currentPage = await botArmAction.prevPage();
                  currentWordJson = JSON.parse(currentPage);
                  firstWord = await botCameraAction.firstTerm();
                  firstWordJson = JSON.parse(firstWord);
                  lastWord = await botCameraAction.lastTerm();
                  lastWordJson = JSON.parse(lastWord);

              }
          }

      }
};

export default findWord;