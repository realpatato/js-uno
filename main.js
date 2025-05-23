//F5 to preview page
//constant variables for canvas (basically an embedded screen),
//ctx (basically the renderer for the screen),
//img (just an empty image object which will hold the spritesheet)
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();

class Card {
  /*
  The class for constructing a Card object
  It holds the spritesheet, the sprite_img_data (the x and y pos on the 
  spritesheet), the color and number seperately (obtained from col_num),
  and the x and y position of the card
  */
  constructor(spritesheet, sprite_img_data, col_num) {
    /*
    Method for constructing card object
    */
    //spritesheet and sprite data is stored
    this.spritesheet = spritesheet;
    this.sprite_img_data = sprite_img_data;
    //here it takes the first character and sets it as the color
    //colors are one character names (R, G, B, Y, W)
    this.color = col_num.slice(0, 1);
    //hidden color for the wild cards to be able to be played on
    //given another color when played
    if (this.color == 'W') {
      this.hidden_color = 'W';
    }
    //takes number and sets it as the number
    this.number = col_num.slice(1);
    //pos is set to 0, 0
    this.x_pos = 0;
    this.y_pos = 0;
    //creates a box for detecting if hovering over
    this.hover_box_height = 84;
    //stores if the card is flipped or not
    this.is_flipped = false;
  }

  get_needed_sprite_info() {
    /*
    Just checks if the card is flipped and sets the sprite to
    be that when drawn
    */
    if (this.is_flipped == false) {
      let needed_sprite_info = [
        this.sprite_img_data[this.color][this.color+this.number][0],
        this.sprite_img_data[this.color][this.color+this.number][1]
      ];
      return needed_sprite_info;
    } else {
      let needed_sprite_info = [
        this.sprite_img_data['W']['BACKSIDE'][0],
        this.sprite_img_data['W']['BACKSIDE'][1]
      ];
      return needed_sprite_info;
    }
  }

  draw_card() {
    /*
    Function for drawing the card
    */
    let needed_sprite_info = this.get_needed_sprite_info();
    //uses the drawImage method of context
    ctx.drawImage(
      this.spritesheet, //takes in spritesheet
      needed_sprite_info[0], //the x
      needed_sprite_info[1], //and y
      32, //the original width in the spritesheet
      42, //and height
      this.x_pos, //the cards x
      this.y_pos, //and y pos on the canvas
      64, //the width
      84 //and height of the drawn image (scales it up if bigger)
    );
    if (this.color == 'W') {

    }
  }

  get_index(hand_cards) {
    /*
    Gets the index of the card
    */
    //loops over the cards in the hand
    for (const [index, loop_card] of hand_cards.entries()) {
      //checks if the card matches itself
      if (loop_card == this) {
        //returns the index
        return index;
      }
    }
  }

  get_card_use() {
    /*
    Gets what the card DOES based on its number
    */
    if (this.color == 'W') {
      if (this.number == 'P4') {
        console.log("WILD PLUS FOUR PLAYED")
        this.wild()
      } else {
        console.log("WILD PLAYED")
        this.wild()
      }
    } else {
      if (this.number == 'S') {
        console.log("SKIP PLAYED")
      } else if (this.number == 'R') {
        console.log('REVERSE PLAYED')
      } else if (this.number == 'P2') {
        console.log('PLUS 2 PLAYED')
      } else {
        console.log('NON-SPECIAL CARD')
      }
    }
  }

  wild() {
    for (const button of wild_buttons) {
      button.is_shown = true;
    }
  }

  set_x(num) {
    /*
    Sets the x_pos to a new value
    */
    this.x_pos = num;
  }

  set_y(num) {
    /*
    Sets the y_pos to a new value
    */
    this.y_pos = num;
  }

  set_hover_box_height(num) {
    /*
    Sets the hover box y to a new value
    */
   this.hover_box_height = num;
  }
}

class Deck {
  /*
  Class which handles deck functionality
  */
  constructor(deck, type) {
    this.cards = deck;
    this.type = type;
  }

  shuffle_deck() {
    /*
    shuffles the deck
    */
    //swaps two cards 1000 times
    for (let i = 0; i < 1000; i++) {
      //gets two indexes in the list
      let card_pos_a = generate_random_int(0, this.cards.length);
      let card_pos_b = generate_random_int(0, this.cards.length);
      //swaps them, using a temporary value so no data is lost
      let temp = this.cards[card_pos_a];
      this.cards[card_pos_a] = this.cards[card_pos_b];
      this.cards[card_pos_b] = temp;
    }
  }

  flip_cards() {
    /*
    Flips the cards in the deck over
    Allows for them to be drawn, but not seen
    */
    for (const card of this.cards) {
      card.is_flipped = true;
    }
  }

  set_card_pos() {
    /*
    Sets the cards to the proper positions based on which deck 
    type it is
    */
    //checks type of deck
    if (this.type == "draw") {
      for (const card of this.cards) {
        //centered y
        card.set_y(342);
        //offset from middle by a tad
        card.set_x(544);
      }
    } else {
      for (const card of this.cards) {
        //centered y
        card.set_y(342);
        //offset from middle by a tad
        card.set_x(640);
      }
    }
  }

  give_out_card(hand) {
    /*
    Gives out a card and removes one from the deck
    */
    //gets the last card of the deck
    let last_card = this.cards[this.cards.length - 1];
    //flips it so that it is dealt
    last_card.is_flipped = false;
    //adds last card in deck to hand
    hand.cards.push(last_card);
    //removes it from deck
    this.cards = this.cards.slice(0, this.cards.length - 1);
  }
}

class Hand {
  constructor(cards) {;
    this.cards = cards;
  }

  center_cards() {
    /*
    Centers the cards in the hand
    */
    //This finds where to start the hand from
    let beginning_offset = 624 - (32 * ((this.cards.length/2) + 0.5));
    for (const [index, card] of this.cards.entries()) {
      //sets each cards position to the offset plus
      //the amount they shift from that starting position
      card.set_x(beginning_offset+(32*index));
      card.set_y(642);
    }
  }

  use_card(card, play_deck) {
    /*
    Uses a card
    */
    //gets the index of the card
    let card_index = card.get_index(this.cards);
    card.get_card_use();
    //adds it to the play deck
    play_deck.push(card);
    //removes the used card
    this.cards = this.cards.slice(0, card_index).concat(this.cards.slice(card_index+1));
  }
}

class WildButton {
  /*
  The buttons seen when you play a wild card
  */
  constructor(color, x, y) {
    /*
    Gives the button an x and a y
    a variable to mark if its shown
    and a variable for its color
    */
    this.color = color;
    this.color_name = this.get_color_name();
    this.x = x;
    this.y = y;
    this.is_shown = false;
  }
  
  draw_button() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 32, 32);
    ctx.strokeRect(this.x, this.y, 32, 32);
  }

  get_color_name() {
    /*
    Gets the color name value based on the hex color
    */
    if (this.color == "#ED1C24") {
      return "R";
    } else if (this.color == "#4C6CF4") {
      return "B";
    } else if (this.color == "#FCC40C") {
      return "Y";
    } else {
      return "G";
    }
  }

  set_buttons_false() {
    for (const button of wild_buttons) {
      button.is_shown = false;
    }
  }
}

function generate_random_int(min, max) {
  /*
  Generates random number
  There is no easy built in library or function in JavaScript
  */
  return Math.floor(Math.random() * (max - min)) + min;
}

/* The following section of code is the generation of the deck */
/* It generates names, spritesheet data, and the actual deck object */

function gen_sprite_img_data() {
  /*
  Generates the sprite_img_data (the x and y offsets in the spritesheet
  for each sprite)
  */
  //dictionary for the sprites
  let data = {};
  //names for each of the rows for easy storage
  let row_names = ['R', 'B', 'Y', 'G'];
  //names of the last three cards in each row, since they aren't just
  //numbers
  let card_names = ['S', 'R', 'P2'];
  //names for the last row cards, since theres only three
  let last_row = ['BACKSIDE', 'W', 'WP4'];
  //loop begins
  for (let row = 0; row < 5; row++) {
    //checks if we're on the last row
    if (row == 4) {
      //creates a temporary dictionary to store the last row cards
      temp_data={};
      for (let col = 0; col < 3; col++) {
        //store the offsets as the correct name and multiply to find 
        //coordinates
        temp_data[last_row[col]] = [32*col, 42*row];
      }
      //sets it as the WILD color in the dictionary
      data["W"] = temp_data;
    } else { //if its not the last row
      //temp dictionary to store the row
      temp_data={};
      //loop over the columns
      for (let col = 0; col < 13; col++) {
        //check if we're on the ones without numbers
        if (col > 9) { //if we're not doing numbers
          //set the name of the card as the color plus the special name
          temp_data[row_names[row]+card_names[col-10]] = [32*col, 42*row];
        } else { //otherwise
          //set the name to the color and the column number
          temp_data[row_names[row]+col] = [32*col, 42*row];
        }
      }
      //add the row data to the sprite data dictionary
      data[row_names[row]] = temp_data;
    }
  }
  //return the value
  return data;
}

//create the sprite_img_data and store it as a variable
let sprite_img_data=gen_sprite_img_data();

function gen_str_deck() {
  /*
  Generates and list of strings representative of the cards for easy 
  card object creation
  */
  //start with and empty list for adding to
  let deck = [];
  //names for non-number cards
  card_names = ['S', 'R', 'P2'];
  //loop over the colors in the sprite data dictionary
  for (const color in sprite_img_data) {
    //if its WILD
    if (color == "W") {
      //adds 4 regular wild cards and 4 +4 wild cards
      for (let i = 0; i < 4; i++) {
        deck.push(color);
        deck.push(color+"P4");
      }
    } else { //if its not a wild card
      //add card 0-9 and the special ones
      for (let i = 0; i < 13; i++) {
        if (i > 9) {
          deck.push(color+card_names[i-10]);
        } else {
          deck.push(color+i);
        }
      }
      //add card 1-9 and the special ones
      for (let i = 1; i < 13; i++) {
        if (i > 9) {
          deck.push(color+card_names[i-10]);
        } else {
          deck.push(color+i);
        }
      }
    }
  }
  //return the list of strings
  return deck;
}

//create the list of strings and store it as a variable
let str_deck = gen_str_deck();

function gen_deck() {
  /*
  Generates the cards and stores them using the list of strings and the
  sprite_img_data
  */
  //empty list to store the deck
  let deck = [];
  //adds all the cards with the proper color, number, and
  //sprite_img_data
  for (let i = 0; i < str_deck.length; i++) {
    deck.push(new Card(img, sprite_img_data, str_deck[i]));
  }
  //return list of objects
  return deck;
}

//generate the list of card object and store it as a varible
let draw_deck = gen_deck();
//creates deck object with deck
draw_deck = new Deck(draw_deck, "draw");
//shuffles the deck
draw_deck.shuffle_deck();
//flips the cards in the deck over
draw_deck.flip_cards();
//sets the deck to the correct position
draw_deck.set_card_pos();

/* Deck creation ends here */

function create_player_hand(hand) {
  /*
  Creates player hand by dealing out cards
  */
  for (let i = 0; i < 7; i++) {
    draw_deck.give_out_card(hand);
  }
}

//creates hand object with empty hand
let player_hand = new Hand([]);
//adds cards to hand
create_player_hand(player_hand);
//centers the cards
player_hand.center_cards();

//creates the deck that will be played with
let play_deck = new Deck([], "play");
//given one card
draw_deck.give_out_card(play_deck);
//positions play deck
play_deck.set_card_pos();

//create list of colors for wild buttons to use
let button_colors = ["#ED1C24", "#4C6CF4", "#FCC40C", "#24B44C"]
//create empty list to store the buttons
let wild_buttons = []
//create the wild buttons
for (let i = 0; i < 4; i++) {
  wild_buttons.push(new WildButton(button_colors[i], 512+(64*i), 568))
}

function get_mouse_pos(event) {
  /*
  Gets the current position of the mouse
  */
  //gets the canva rect, giving its position relative to the viewport
  const canvas_rect = canvas.getBoundingClientRect();
  //gets the x pos by subtracting the mouse by the canvas x position
  const x = event.clientX - canvas_rect.left;
  //gets the y pos by subtracting the mouse by the canvas y position
  const y = event.clientY - canvas_rect.top;
  //returns the x and y position
  return [x, y];
}

//sets the source of the image to the spritesheet
img.src = "uno-cards.png";
//without this, the image gets all blurry
ctx.imageSmoothingEnabled= false;

//sets the game loop to run 30 times per second (30 fps)
let intervalLoop = setInterval(main, 1000/30);
//upon loading the spritesheet, start the loop
img.onload = intervalLoop;

//adds an event listener for mouse movement
canvas.addEventListener('mousemove', (event) => {
  //gets the mouse position
  mouse_pos = get_mouse_pos(event);
  //sets the card to null first, prevents later statement to occur
  selected_card = null;
  //iterates of all cards in deck
  for (const card of player_hand.cards) {
    //checks if the card is somewhere on the card
    if ((mouse_pos[0] >= card.x_pos) && (mouse_pos[0] <= card.x_pos+64)) {
      if ((mouse_pos[1] >= card.y_pos) && (mouse_pos[1] <= card.y_pos+card.hover_box_height)) {
        //sets the card to be the LAST card found in the list
        selected_card = card;
      }
    }
  }
  //if a card was found basically, null returns false and the class
  //returns true
  if (selected_card) {
    //every card has its y set to the bottom
    for (const card of player_hand.cards) {
      card.set_y(642);
      card.set_hover_box_height(84);
    }
    //the selected card gets moved up a bit
    selected_card.set_y(600);
    selected_card.set_hover_box_height(126);
  }
});

//adds event listener for a click
canvas.addEventListener('click', (event) => {
  //gets the mouse position
  mouse_pos = get_mouse_pos(event);
  //sets the card to null first, prevents later statement to occur
  selected_card = null;
  //iterates over deck
  for (const card of player_hand.cards) {
    //checks if the card is somewhere on the card
    if ((mouse_pos[0] >= card.x_pos) && (mouse_pos[0] <= card.x_pos+64)) {
      if ((mouse_pos[1] >= card.y_pos) && (mouse_pos[1] <= card.y_pos+card.hover_box_height)) {
        //sets the card to be the LAST card found in the list
        selected_card = card;
      }
    }
  }
  //if a card was found to be clicked on
  if (selected_card) {
    //giant if statement which check for any of the following:
    //the color is the same as the playing card
    //the number is the same as the playing card
    //the card is a wild card
    if (play_deck.cards[play_deck.cards.length - 1].color == 'W') {
      if ((selected_card.color == play_deck.cards[play_deck.cards.length - 1].hidden_color) 
        || (selected_card.number == play_deck.cards[play_deck.cards.length - 1].number) 
        || (selected_card.color == 'W')) {
        player_hand.use_card(selected_card, play_deck.cards);
        player_hand.center_cards();
        play_deck.set_card_pos();
      }
    } else {
      if ((selected_card.color == play_deck.cards[play_deck.cards.length - 1].color) 
        || (selected_card.number == play_deck.cards[play_deck.cards.length - 1].number) 
        || (selected_card.color == 'W')) {
        player_hand.use_card(selected_card, play_deck.cards);
        player_hand.center_cards();
        play_deck.set_card_pos();
      }
    }
  } else if ((mouse_pos[1] >= draw_deck.cards[draw_deck.cards.length - 1].y_pos) && (mouse_pos[1] <= draw_deck.cards[draw_deck.cards.length - 1].y_pos+84)) {
    //check for draw pile click
    if ((mouse_pos[0] >= draw_deck.cards[draw_deck.cards.length - 1].x_pos) && (mouse_pos[0] <= draw_deck.cards[draw_deck.cards.length - 1].x_pos+64)) {
      //gives the player a card
      draw_deck.give_out_card(player_hand);
      player_hand.center_cards();
      console.log("card drawn");
      //checks if the the draw deck is empty
      if (draw_deck.cards.length == 0) {
        console.log("swapped decks");
        //swaps the draw deck and play deck
        let temp = draw_deck;
        draw_deck = play_deck;
        play_deck = temp;
        //changes their type so that the positioning works
        draw_deck.type = 'draw';
        play_deck.type = 'play';
        //gives the play deck a card to start out with
        draw_deck.give_out_card(play_deck);
        //sets the positions of the decks
        draw_deck.set_card_pos();
        play_deck.set_card_pos();
        //shuffles the draw deck and flips it
        draw_deck.flip_cards();
        draw_deck.shuffle_deck();
      }
    }
  } else if (wild_buttons[0].is_shown) {
    for (const button of wild_buttons) {
      if ((mouse_pos[0] >= button.x) && (mouse_pos[0] <= button.x+32)) {
        if ((mouse_pos[1] >= button.y) && (mouse_pos[1] <= button.y+32)) {
          play_deck.cards[play_deck.cards.length - 1].hidden_color = button.color_name;
          button.set_buttons_false()
        }
      }
    }
  }
})

//sets the draw deck to the correct position to represent the draw deck

function main() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const card of player_hand.cards) {
    card.draw_card();
  }
  for (const card of draw_deck.cards) {
    card.draw_card();
  }
  for (const card of play_deck.cards) {
    card.draw_card();
  }
  if (wild_buttons[0].is_shown) {
    for (const button of wild_buttons) {
      button.draw_button();
    }
  }
  console.log(play_deck.cards[play_deck.cards.length - 1].hidden_color)
}