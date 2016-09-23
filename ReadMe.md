# Deck of Cards - Solitaire

### What works:
  - [x] Refreshing the page starts a new game
  - [x] Click deck to open new card
  - [x] Double click open card(s) to place it (them) in appropriate stack
  - [x] Drag and drop open card(s) to place it (them) in appropriate stack
  - [x] Auto complete option, once all cards are open

### What doesn't:
  - [ ] Drag and drop of multiple cards shows only one card in the drag image
  - [ ] Works only in Chrome (and Opera. Essentially browsers using the Blink rendering engine)

### What is NOT there:
  - Settings
  - Options for card deck
  - Undo
  - Hint / Clue for next move
  - Save an in-progress game so that you can come back to it later

### Areas to Improve: (that I know of for now)
  - No jQuery or any other library used. So the code is buried under document.getSomethingOrTheOther type syntax
  - There are around 25 to 30 lines of code just adding event listeners.
  - Lots of replicated logic. Should ideally be isolated into a function but haven't done that yet.
