import botArmAction from '../utils/botArmActions';
import botCameraAction from '../utils/botCameraActions';
import getBotStatus from '../handlers/statusHandler';





const findWord = async (req) =>{
  let currentPage;
  let currentPageJson;
  let firstWord;
  let firstWordJson;
  let lastWord;
  let lastWordJson;
  let currentWordJson;
  let currentWord;
  let count = 0;

  let wordToFind;
      if (!req.query.term)
          throw new Error('Invaid query parameter');
      wordToFind = req.query.term.toUpperCase();
      console.log('WORD TO BE FOUND ---- ', wordToFind);

      try {
          if (wordToFind.charAt(0) <= 'M') {
              console.log('Start from first page');
              // Search from start
              currentPage = await botArmAction.firstPage();
              currentPageJson = JSON.parse(currentPage);
              // get the last word of the page
              lastWord = await botCameraAction.lastTerm();
              lastWordJson = JSON.parse(lastWord);

              // set the bot camera to look at the first word
              firstWord = await botCameraAction.firstTerm();
              firstWordJson = JSON.parse(firstWord);
              currentWordJson =firstWordJson;
              // flip pages till the last page
              while (currentPageJson.hasNextPage){
                  console.log('-----------------------------------------------------------------');
                  count++;
                  if ( (firstWordJson.currentTerm.charAt(0) <= wordToFind.charAt(0)) && (lastWordJson.currentTerm.charAt(0) >= wordToFind.charAt(0)) && (firstWordJson.currentTerm.charAt(1) <= wordToFind.charAt(1)) && (lastWordJson.currentTerm.charAt(1) >= wordToFind.charAt(1)) && (wordToFind.charAt(2) >= firstWordJson.currentTerm.charAt(2)) && wordToFind.charAt(2) <= lastWordJson.currentTerm.charAt(2)) {
                      console.log('We have satisfied the condition where the first 3 letters match....');
                      console.log('First word --- ', firstWordJson);
                      console.log('Last Word --- ', lastWordJson);
                      if (wordToFind.charAt(2) > 'M') {
                          currentWordJson = lastWordJson;
                          while (currentWordJson.hasPreviousTerm) {
                            if (currentWordJson.currentTerm === wordToFind) {
                              return currentWordJson.currentTermDefinition;
                            }
                            if (currentWordJson.currentTerm.charAt(2) < wordToFind.charAt(2)) {
                                console.log('Last word closet to it is --- ', currentWordJson);
                                return "Word not found"
                            }
                            currentWord = await botCameraAction.prevTerm();
                            currentWordJson = JSON.parse(currentWord);
                          }
                      } else {
                          console.log('Starting the search from start as it is less than M')
                          currentWordJson = firstWordJson;
                          while(currentWordJson.hasNextTerm) {
                              if (currentWordJson.currentTerm === wordToFind) {
                                  return currentWordJson.currentTermDefinition;
                              }
                              if (currentWordJson.currentTerm.charAt(2) > wordToFind.charAt(2)) {
                                  console.log('Closest word is ---- ', currentWordJson);
                                  return "Word not found";
                              }
                              currentWord = await botCameraAction.nextTerm();
                              currentWordJson = JSON.parse(currentWord);
                          }
                          return "Word not found";
                      }

                  } else if (!(wordToFind.charAt(2)) && (firstWordJson.currentTerm.charAt(0) <= wordToFind.charAt(0)) && (lastWordJson.currentTerm.charAt(0) >= wordToFind.charAt(0)) && (firstWordJson.currentTerm.charAt(1) <= wordToFind.charAt(1)) && (lastWordJson.currentTerm.charAt(1) >= wordToFind.charAt(1))){
                      console.log('Satified condition where only 2 match');
                      console.log('First word --- ', firstWordJson);
                      console.log('Last Word --- ', lastWordJson);
                      if (wordToFind.charAt(1) >= 'M') {
                          currentWordJson = lastWordJson;
                          while (currentWordJson.hasPreviousTerm) {
                              if (currentWordJson.currentTerm === wordToFind) {
                                  return currentWordJson.currentTermDefinition;
                              }
                              currentWord = await botCameraAction.prevTerm();
                              currentWordJson = JSON.parse(currentWord);
                          }
                      } else {
                          currentWordJson = firstWordJson;
                          while (currentWordJson.hasNextTerm) {
                              if (currentWordJson.currentTerm === wordToFind){
                                  return currentWordJson.currentTermDefinition;
                              }
                              currentWord = await botCameraAction.nextTerm();
                              currentWordJson = JSON.parse(currentWord);
                          }
                      }
                  } else if (!(wordToFind.charAt(1)) && (firstWordJson.currentTerm.charAt(0) <= wordToFind.charAt(0)) && (lastWordJson.currentTerm.charAt(0) >= wordToFind.charAt(0))) {
                      console.log('Satified condition where only 1 match...');
                      console.log('First word --- ', firstWordJson);
                      console.log('Last Word --- ', lastWordJson);
                      currentWordJson = firstWordJson;
                      while (currentWordJson.hasNextTerm) {
                          if (currentWordJson.currentTerm === wordToFind){
                              return currentWordJson.currentTermDefinition;
                          }
                          currentWord = await botCameraAction.nextTerm();
                          currentWordJson = JSON.parse(currentWord);
                      }
                  } else {
                      if (wordToFind.charAt(0) < currentWordJson.currentTerm.charAt(0)){
                          console.log('The character went past the word and the word was not found');
                          return "word not found";
                      }
                  }
                  currentPage = await botArmAction.nextPage();
                  currentPageJson = JSON.parse(currentPage);
                  firstWord = await botCameraAction.firstTerm();
                  firstWordJson = JSON.parse(firstWord);
                  lastWord = await botCameraAction.lastTerm();
                  lastWordJson = JSON.parse(lastWord);
                  console.log('-------------------------------- ' +count+ ' --------------------------------------------');
              }
          } else {
              console.log('Start from last page');
              // start from last page
              currentPage = await botArmAction.lastPage();
              currentPageJson = JSON.parse(currentPage);

              // get the last word of the page
              lastWord = await botCameraAction.lastTerm();
              lastWordJson = JSON.parse(lastWord);

              // set the bot camera to look at the first word
              firstWord = await botCameraAction.firstTerm();
              firstWordJson = JSON.parse(firstWord);

              while (currentPageJson.hasPreviousPage) {

              }

          }

      } catch (e) {
          throw Error(e);
      }



};



// const findWord = async (req) => {
//     let termResponse = {};
//     let firstTerm;
//     let lastTerm;
//     let currentTerm;
//     let currentWord;
//     let currentTermDefinition;
//     let currentPage;
//     let currentPageJson;
//     let currentTermJson;
//     let wordToFind = req.query.term.toUpperCase();
//     try {
//         // Reset the bot to look at the first word of a new page.
//         let status = await getBotStatus();
//         let jsonStatus = JSON.parse(status);
//         if (jsonStatus.hasPreviousTerm) {
//             await botCameraAction.firstTerm();
//         }
//         // If the word is less than M start lookup from beginning else start lookup from end.
//         if (wordToFind.charAt(0) < 'M') {
//             currentPage =  await botArmAction.firstPage();
//             currentPageJson = JSON.parse(currentPage);
//             // Till there is next page.
//             while (currentPageJson.hasNextPage) {
//                 currentWord = currentPageJson.currentTerm;
//                 currentTermDefinition = currentPageJson.currentTermDefinition;
//                 // Till there is next word on that page.
//                 while(currentPageJson.hasNextTerm) {
//                     // if the word is found return the object.
//                     if (currentWord === wordToFind) {
//                         return termResponse = {
//                             currentWord: currentWord,
//                             currentTermDefinition: currentTermDefinition
//                         };
//                     }
//                     // Else select the next term.
//                     currentTerm = await botCameraAction.nextTerm();
//                     currentTermJson = JSON.parse(currentTerm);
//                     currentWord = currentTermJson.currentTerm;
//                     currentTermDefinition = currentTermJson.currentTermDefinition;
//                 }
//                 currentPage = await botArmAction.nextPage();
//                 currentPageJson = JSON.parse(currentPage);
//             }
//         } else {
//             currentPage = await botArmAction.lastPage();
//             currentPageJson = JSON.parse(currentPage);
//             // turn page backwards till the first page.
//             while (currentPageJson.hasPreviousPage){
//                 currentWord = currentPageJson.currentTerm;
//                 currentTermDefinition = currentPageJson.currentTermDefinition;
//                 // Till last word on that page.
//                 while (currentPageJson.hasNextTerm) {
//                     // if word is found return the word
//                    if (currentWord === wordToFind) {
//                        return termResponse ={
//                            currentWord: currentWord,
//                            currentTermDefinition: currentTermDefinition
//                        };
//                    } else {
//                        // Select the next word and repeat.
//                        currentTerm = await botCameraAction.nextTerm();
//                        currentTermJson = JSON.parse(currentTerm);
//                        currentWord = currentTermJson.currentTerm;
//                        currentTermDefinition = currentTermJson.currentTermDefinition;
//                    }
//                 }
//                 currentPage = await botArmAction.prevPage();
//                 currentPageJson = JSON.parse(currentPage);
//             }
//         }
//         return "Word not found";
//
//     } catch (e) {
//         console.log('Error getting status...');
//     }
//
// };

export default findWord;