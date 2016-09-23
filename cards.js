// The main deck of cards. 52 cards without jokers. 4 suits of 13 cards each
var deck = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c0', 'cj', 'cq', 'ck', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd0', 'dj', 'dq', 'dk', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h0', 'hj', 'hq', 'hk', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's0', 'sj', 'sq', 'sk']

// cards in each suit. Used for validations.
var suitC = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c0', 'cj', 'cq', 'ck']
var suitD = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd0', 'dj', 'dq', 'dk']
var suitH = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h0', 'hj', 'hq', 'hk']
var suitS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's0', 'sj', 'sq', 'sk']

// This is the collection of the 4 suits. Used for validations.
var suitList = {'c': suitC, 'd': suitD, 'h': suitH, 's': suitS}

// Collection of cards of the same color
var black    = suitC.concat(suitS)
var red      = suitD.concat(suitH)

var clubs    = []    // top of board - stack of clubs in order
var diamonds = []    // top of board - stack of diamonds in order
var hearts   = []    // top of board - stack of hearts in order
var spades   = []    // top of board - stack of spades in order

// These are the stacks which represent the 7 columns of cards
var column1 = []
var column2 = []
var column3 = []
var column4 = []
var column5 = []
var column6 = []
var column7 = []

var opened = []    // stack of opened cards

//This will hold the shuffled deck of cards. Will be generated once every game at the beginning
var shuffledDeck = []

// This is the random number stack used while shuffling the deck
var randPos = []

// This is used as the collection of the 7 columns.
// Any manipulation on individual columns will be done on the specific column stack. If all the 7 columns have to be processed, do it via the collection
var cols   = [column1, column2, column3, column4, column5, column6, column7]

// Collection of the in-game stacks. Maintain the same order as that in the idList
var stacks = [clubs, diamonds, hearts, spades, column1, column2, column3, column4, column5, column6, column7, shuffledDeck, opened]

// List of IDs of HTML element that can contain cards. Dont change the order
var idList = ['clubs', 'diamonds', 'hearts', 'spades', '1', '2', '3', '4', '5', '6', '7', 'deck', 'open']

// Tracks number of cards currently face up on the board
// The game can definitely be completed if faceUpCount = 52
var faceUpCount = 0

// Check whether game has reached a level where auto complete is possible
var autoComplete = false

// Check if game is over
var gameOver     = false

// Shuffle the deck.
// Add 'b' or 'f' to each card to indicate if it has to be face down or face up on the board.
// 'b' - back or face down
// 'f' - front or face up
// Immediately after shuffling, all cards will be face down. So 'b'
while (shuffledDeck.length < 52){
  let pos = Math.ceil(Math.random() * 52) - 1  //'let' for block scoping
  if (randPos.indexOf(pos) == -1){
    randPos.push(pos)
    shuffledDeck.push('b'+deck[pos])
  }
}

// Populate the columns (use the "cols" collection here)
for (let i = 1; i <= 7; i++){   // 'let' for block scoping
  while (cols[i - 1].length < i){
    // if this is the last card in a particular column, add 'f' to it to make it face up
    if (cols[i - 1].length == (i - 1)){
      cols[i - 1].push('f'+shuffledDeck.pop().slice(1))
    } else {
      cols[i - 1].push(shuffledDeck.pop())
    }
  }
}

// generate HTML <img> element to display on screen
function cardImg(card){
  var img = document.createElement('img')

  // If first char is 'b', card is displayed face down, else card image is displayed
  if (card.slice(0,1) == 'b'){
    img.src = 'img/b1fv.png'
    img.alt = 'card'
    img.id = 'b1fv'
  } else {
    img.src = 'img/'+card.slice(1)+'.png'
    img.alt = 'open card'
    img.id = card.slice(1)
  }

  return img
}

// This displays the board initially
function showBoard(){
  document.getElementById('deck').appendChild(cardImg('b1fv'))

  for(let i = 0; i < cols.length; i++){
    displayCols(cols[i], i+1)
  }
}

// This displays the individual column. Initially, only last card will be face up. As the game goes on, all cards in a given column must be face up.
function displayCols(col, id){

  document.getElementById(id).innerHTML = ''

  for(let j = 0; j < col.length; j++){
    document.getElementById(id).appendChild(cardImg(col[j]))
  }

  positionCols(id)
}

// This handles the display on the cards in the columns. It manipulates the 'position' property to make sure the cards in the columns appear to be overlapping instead of being displayed as a train.
function positionCols(colId){
  var cardCol = document.getElementById(colId).childNodes

  for(let i = 0; i < cardCol.length; i++){

    if (i > 0){
      cardCol[i].style.position = 'relative'
      cardCol[i].style.top = 'calc(-10 * '+i+' * (1vh + 1vw) / 2)'
    }

  }
}

// This is triggered when the deck is clicked. Does the following
// - opens the next card of the deck
// - if the deck is empty, recycles the open cards
function openCard(){
  // if shiffledDeck length is > 0, it means we can still open cards
  if (shuffledDeck.length > 0){
    var curCard = 'f'+shuffledDeck.pop().slice(1)
    opened.push(curCard)

    document.getElementById('open').innerHTML = ''
    document.getElementById('open').appendChild(cardImg(curCard))

    // when all cards are opened, the deck is empty
    if (shuffledDeck.length == 0){
      document.getElementById('deck').innerHTML = ''
    }
  } else {
    // Clicking on the empty deck will recycle the open cards
    document.getElementById('open').innerHTML = ''
    document.getElementById('deck').appendChild(cardImg('b1fv'))

    // Convert all cards to face down state while recycling. This might not be necessary but am doing it just in case. Will revisit this later to decide on keeping this.
    while (opened.length > 0){
      shuffledDeck.push('b'+opened.pop().slice(1))
    }
  }
}

// Drag and Drop routine
// event handler for 'dragstart' - when a card is picked up for dragging, store
// - the card ID
// - the stack it is coming from
// - whether it is a single card or set of cards
function drag_start(e){
  e.stopPropagation()

  e.dataTransfer.setData("card", e.target.id)
  e.dataTransfer.setData("from", e.target.parentElement.id)

  var fromIdIdx = idList.indexOf(e.target.parentElement.id)
  var fromStack = stacks[fromIdIdx]

  if ((stacks[fromIdIdx].length - 1) == stacks[fromIdIdx].indexOf('f'+e.target.id)){
    e.dataTransfer.setData("single", true)
  } else {
    e.dataTransfer.setData("single", false)
  }
}

// Drag and Drop routine
// Not sure why but the 'dragover' event needs mandatory handling to ensure that the 'drop' event is properly fired. So this is the dummy event handler for 'dragover'
function drag_over(e){
  e.preventDefault()
}

// Drag and Drop routine
// event handler for drop. Does all the validations to check if the drop is valid or not and then allows the drop.
function drop(e){
  e.stopPropagation()

  var doDrop  = false // give go/no-go for the drop after validating
  var cardPos = -1    // used while validating
  var toId    = ''    // tracks the target id for the drop

  var lastInSuitOnBoard = '' // track the current last card in the top-suit
  var lastInColOnBoard  = '' // track the current last card in the columns
  var suitOfLastInCol   = '' // track the suit of the last card in the columns

  // retrieving data from dataTransfer object that we populated via the 'dragstart' event
  var img     = e.dataTransfer.getData("card") // the card to be dropped

  var imgSuit = img.slice(0,1)                     // suit of card picked
  var singleImg = e.dataTransfer.getData("single") // single card or multiple

  var fromId    = e.dataTransfer.getData("from")   // source ID of the card
  var fromIdIdx = idList.indexOf(fromId)
  var fromStack = stacks[fromIdIdx]                // identify the source stack

  // identify the target stack
  var toIdIdx   = idList.indexOf(e.target.id)
  if (toIdIdx >= 0){
    toId = e.target.id
  } else {
    toId = e.target.parentElement.id
    toIdIdx = idList.indexOf(toId)
  }

  if (img.slice(0,1) != 'b'){  // make sure to allow only face-up cards

    cardPos = suitList[imgSuit].indexOf(img)

    if (toIdIdx <= 3){         // target for drop is the top-suit

      if (singleImg == 'true'){// make sure to drop only single card on top suit

        // If the top suit already has cards, check that the card being dropped is in sequence
        if (stacks[toIdIdx].length > 0){
          lastInSuitOnBoard = stacks[toIdIdx].slice(stacks[toIdIdx].length - 1)[0].slice(1)
          if (cardPos == suitList[imgSuit].indexOf(lastInSuitOnBoard) + 1){
            doDrop = true
          }
        } else {
          // if the top suit is empty, check that the card being dropped is the first card of the suit
          // also check that the first card is dropped into the correct stack
          // (e.g., Ace of spades must go only into the stack marked as spades)
          if ((cardPos == 0) && (toId.slice(0,1) == imgSuit)){
            doDrop = true
          }
        }

      }

    } else { // target for drop is any of the columns

      if ((img.slice(1) == 'k') && (stacks[toIdIdx].length == 0)){
        doDrop = true
      } else {

        if (stacks[toIdIdx].length > 0){
          lastInColOnBoard = stacks[toIdIdx].slice(stacks[toIdIdx].length - 1)[0].slice(1)
          suitOfLastInCol  = lastInColOnBoard.slice(0,1)

          if (((black.indexOf(lastInColOnBoard) > -1) && (red.indexOf(img) > -1)) || ((red.indexOf(lastInColOnBoard) > -1) && (black.indexOf(img) > -1))){
            if (cardPos == suitList[suitOfLastInCol].indexOf(lastInColOnBoard) - 1){
              doDrop = true
            }
          }
        }

      }

    }
  }

  if (doDrop){
    dropCardOnTarget(fromId, fromStack, toId, toIdIdx, img)
  }
}

function dropCardOnTarget(fromId, fromStack, toId, toIdIdx, img){
  if (toIdIdx <= 3){ // if drop is on the top-suit
    document.getElementById(toId).innerHTML     = ''
    document.getElementById(img).style.top      = ''
    document.getElementById(img).style.position = ''
    document.getElementById(toId).appendChild(document.getElementById(img))
  }

  // move the card / cards to the appropriate stack after the drop
  var cardsToMove = fromStack.splice(fromStack.indexOf('f'+img))
  while (cardsToMove.length > 0){
    stacks[toIdIdx].push(cardsToMove.shift())
  }

  // After dropping the card, turn the last card in the 'fromStack' faceup
  if (fromStack.length > 0){
    fromStack.push('f'+fromStack.pop().slice(1)) // this marks the last card to be 'faceup'
  }
  refreshOpenCard(fromId, fromStack) // this refreshes the display of the 'fromStack'

  if (toIdIdx > 3){ // if the drop is on one of the columns, refresh the display of the target stack also
    refreshOpenCard(toId, [])
  }

  if (! autoComplete){
    canAutoComplete() // check if the game can be autocompleted at this point
  }

  if (autoComplete){
    if (document.getElementById('auto').classList.contains('hide')){
      document.getElementById('auto').classList.remove('hide')
      document.getElementById('auto').classList.add('show')
    }
  }

  if (!gameOver){
    checkGameOver()
  }

  if (gameOver){
    if (document.getElementById('gameover').classList.contains('hide')){
      document.getElementById('gameover').classList.remove('hide')
      document.getElementById('gameover').classList.add('show')
    }
  }

}

function refreshOpenCard(id, stack){
  // if (id == 'open'){
  if (id.length > 1){
    var nextOpen = ((stack.length > 0) ? stack.slice(stack.length-1)[0] : '')
    document.getElementById(id).innerHTML = ''
    if (nextOpen != ''){
      document.getElementById(id).appendChild(cardImg(nextOpen))
    }
  } else {
    displayCols(cols[id - 1], id)
  }
}

function canAutoComplete(){
  faceUpCount = 0
  for (let i = 0; i < stacks.length; i++){
    faceUpCount += stacks[i].reduce(function(num, element){
      num += ((element.slice(0,1) == 'f') ? 1 : 0)
      return num
    }, 0)
  }

  if ((faceUpCount == 52) && (opened.length == 0) && (shuffledDeck.length == 0)){
    autoComplete = true
  }
}

function finish(colId){
  var colId = ((colId < 7) ? colId : 0)

  if (cols[colId].length > 0){
    var img       = cols[colId][cols[colId].length - 1].slice(1)
    var imgSuit   = img.slice(0,1)
    var fromId    = '' + (colId + 1)
    for (let i = 0; i < 4; i++){
      if (idList[i].slice(0,1) == imgSuit){
        var toId = idList[i]
        break
      }
    }
    var curCard = document.getElementById(img)
    var dclickEvent = document.createEvent('MouseEvents')
    dclickEvent.initEvent('dblclick', true, true)
    curCard.dispatchEvent(dclickEvent)
  }
  colId += 1

  var cardsRemaining = cols.reduce(function(x, y){
    x += y.length
    return x
  }, 0)

  if (cardsRemaining > 0){
    setTimeout(function(){
      finish(colId)
    }, 100)
  }
}

function finishGame(){
  finish(0)
}

function wait(ms){
  var start = end = new Date().getTime()

  while (end < start + ms){
    end = new Date().getTime()
  }

  console.log("wait")

}

function checkGameOver(){
  var sum = 0

  for (let i = 0; i < 4; i++){
    sum += stacks[i].length
  }

  gameOver = ((sum == 52) ? true : false)
}

// double-click functionality on any open card. If valid, put the double-clicked card into the appropriate top suit
function doubleClickCard(e){
  e.stopPropagation()

  // use this is to track if the clicked card can be dropped anywhere on the board
  // the order will be:
  // - top suits first
  // - any eligible column strating from the left
  var cardIsDropped = false

  var img = e.target.id
  // Check that a card is double clicked. If a card is clicked, it will have a 2 char ID
  if (img.length == 2){

    var imgSuit = img.slice(0,1)
    var fromId  = e.target.parentElement.id
    var fromIdIdx = idList.indexOf(fromId)
    var fromStack = stacks[fromIdIdx]
    var toId      = ''
    var toIdIdx   = ''
    var cardPos = suitList[imgSuit].indexOf(img)
    var lastInSuitOnBoard = ''
    var lastInColOnBoard  = ''
    var suitOfLastInCol   = ''

    // if double clicking on a set of cards in one of the columns, we don't want the drop to happen in the top suitList
    // So check if double click is on card set and if so, set a default 'toId' value so that the underlying logic will redirect to the right place.
    if (fromStack.slice(fromStack.indexOf('f'+img)).length > 1){
      toId = 'cols'
    }

    while (!cardIsDropped){
      if (toId == ''){

        for (let i = 0; i < 4; i++){
          if (idList[i].slice(0,1) == imgSuit){
            toId    = idList[i]
            toIdIdx = i
            break
          }
        }

        if (stacks[toIdIdx].length > 0){

          lastInSuitOnBoard = stacks[toIdIdx].slice(stacks[toIdIdx].length - 1)[0].slice(1)
          if (cardPos == suitList[imgSuit].indexOf(lastInSuitOnBoard) + 1){
            dropCardOnTarget(fromId, fromStack, toId, toIdIdx, img)
            cardIsDropped = true
          }

        } else {

          if (cardPos == 0){
            dropCardOnTarget(fromId, fromStack, toId, toIdIdx, img)
            cardIsDropped = true
          }

        }

      } else {

        if (toId == '7'){
          cardIsDropped = true
        } else {
          toId = ((toId.length > 1) ? '1' : '' + (Number(toId) + 1))
          toIdIdx = idList.indexOf(toId)

          if ((img.slice(1) == 'k') && (stacks[toIdIdx].length == 0)){
            dropCardOnTarget(fromId, fromStack, toId, toIdIdx, img)
            cardIsDropped = true
          } else {

            if (stacks[toIdIdx].length > 0){
              lastInColOnBoard = stacks[toIdIdx].slice(stacks[toIdIdx].length - 1)[0].slice(1)
              suitOfLastInCol  = lastInColOnBoard.slice(0,1)

              if (((black.indexOf(lastInColOnBoard) > -1) && (red.indexOf(img) > -1)) || ((red.indexOf(lastInColOnBoard) > -1) && (black.indexOf(img) > -1))){
                if (cardPos == suitList[suitOfLastInCol].indexOf(lastInColOnBoard) - 1){
                  dropCardOnTarget(fromId, fromStack, toId, toIdIdx, img)
                  cardIsDropped = true
                }
              }
            }

          }

        }

      }
    }

  }
}

showBoard()
document.getElementById('deck').addEventListener('click', openCard)
document.getElementById('open').addEventListener('dragstart', drag_start)
document.getElementById('open').addEventListener('dblclick', doubleClickCard)

document.getElementById('auto').addEventListener('click', finishGame)

document.getElementById('clubs').addEventListener('dragstart', drag_start)
document.getElementById('clubs').addEventListener('dragover', drag_over)
document.getElementById('clubs').addEventListener('drop', drop)

document.getElementById('spades').addEventListener('dragstart', drag_start)
document.getElementById('spades').addEventListener('dragover', drag_over)
document.getElementById('spades').addEventListener('drop', drop)

document.getElementById('hearts').addEventListener('dragstart', drag_start)
document.getElementById('hearts').addEventListener('dragover', drag_over)
document.getElementById('hearts').addEventListener('drop', drop)

document.getElementById('diamonds').addEventListener('dragstart', drag_start)
document.getElementById('diamonds').addEventListener('dragover', drag_over)
document.getElementById('diamonds').addEventListener('drop', drop)

document.getElementById('1').addEventListener('dblclick', doubleClickCard)
document.getElementById('1').addEventListener('dragstart', drag_start)
document.getElementById('1').addEventListener('dragover', drag_over)
document.getElementById('1').addEventListener('drop', drop)

document.getElementById('2').addEventListener('dblclick', doubleClickCard)
document.getElementById('2').addEventListener('dragstart', drag_start)
document.getElementById('2').addEventListener('dragover', drag_over)
document.getElementById('2').addEventListener('drop', drop)

document.getElementById('3').addEventListener('dblclick', doubleClickCard)
document.getElementById('3').addEventListener('dragstart', drag_start)
document.getElementById('3').addEventListener('dragover', drag_over)
document.getElementById('3').addEventListener('drop', drop)

document.getElementById('4').addEventListener('dblclick', doubleClickCard)
document.getElementById('4').addEventListener('dragstart', drag_start)
document.getElementById('4').addEventListener('dragover', drag_over)
document.getElementById('4').addEventListener('drop', drop)

document.getElementById('5').addEventListener('dblclick', doubleClickCard)
document.getElementById('5').addEventListener('dragstart', drag_start)
document.getElementById('5').addEventListener('dragover', drag_over)
document.getElementById('5').addEventListener('drop', drop)

document.getElementById('6').addEventListener('dblclick', doubleClickCard)
document.getElementById('6').addEventListener('dragstart', drag_start)
document.getElementById('6').addEventListener('dragover', drag_over)
document.getElementById('6').addEventListener('drop', drop)

document.getElementById('7').addEventListener('dblclick', doubleClickCard)
document.getElementById('7').addEventListener('dragstart', drag_start)
document.getElementById('7').addEventListener('dragover', drag_over)
document.getElementById('7').addEventListener('drop', drop)
