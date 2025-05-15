//F5 to preview page
//constant variables for canvas (basically an embedded screen),
//ctx (basically the renderer for the screen),
//img (just an empty image object which will hold the spritesheet)
const canvas = document.getElementById("canvas")
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
    this.spritesheet = spritesheet;
    this.sprite_img_data = sprite_img_data;
    //here it takes the first character and sets it as the color
    //colors are one character names (R, G, B, Y, W)
    this.color = col_num.slice(0, 1);
    //takes number and sets it as the number
    this.number = col_num.slice(1);
    //pos is set to 0, 0
    this.x_pos = 0;
    this.y_pos = 0;
  }

  draw_card() {
    /*
    Function for drawing the card
    */
   //uses the drawImage method of context
    ctx.drawImage(
      this.spritesheet, //takes in spritesheet
      sprite_img_data[this.color][this.color+this.number][0], //the x
      sprite_img_data[this.color][this.color+this.number][1], //and y
      32, //the original width in the spritesheet
      42, //and height
      this.x_pos, //the cards x
      this.y_pos, //and y pos on the canvas
      64, //the width
      84 //and height of the drawn image (scales it up if bigger)
    );
  }

  change_x(num) {
    /*
    Increases the x_pos
    */
    this.x_pos = this.x_pos + num;
  }

  change_y(num) {
    /*
    Increases the y_pos
    */
    this.y_pos = this.y_pos + num;
  }

  set_y(num) {
    /*
    Sets the y_pos to a new value
    */
    this.y_pos = num
  }
}

function generate_random_int(min, max) {
  /*
  Generates random number
  There is no easy built in library or functionin JavaScript
  */
  return Math.floor(Math.random() * (max - min)) + min;
}

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
let deck = gen_deck();

function shuffle_deck(deck) {
  /*
  shuffles the deck
  */
  //swaps two cards 1000 times
  for (let i = 0; i < 1000; i++) {
    //gets two indexes in the list
    card_pos_a = generate_random_int(0, deck.length)
    card_pos_b = generate_random_int(0, deck.length)
    //swaps them, using a temporary value so no data is lost
    temp = deck[card_pos_a]
    deck[card_pos_a] = deck[card_pos_b]
    deck[card_pos_b] = temp
  }
  //returns the shuffled deck
  return deck
}

//shuffles the deck
deck = shuffle_deck(deck)

function get_mouse_pos(event) {
  /*
  Gets the current position of the mouse
  */
  const canvas_rect = canvas.getBoundingClientRect();
  const x = event.clientX - canvas_rect.left;
  const y = event.clientY - canvas_rect.top;
  return [x, y];
}

img.src = "uno-cards.png";
ctx.imageSmoothingEnabled= false;

let intervalLoop = setInterval(main, 1000/30);
img.onload = intervalLoop;

canvas.addEventListener('mousemove', (event) => {
  mouse_pos = get_mouse_pos(event)
  selected_card = null
  for (const card of deck) {
    if ((mouse_pos[0] >= card.x_pos) && (mouse_pos[0] <= card.x_pos+64)) {
      if ((mouse_pos[1] >= card.y_pos) && (mouse_pos[1] <= card.y_pos+84)) {
        selected_card = card
      }
    }
  }
  if (selected_card) {
    for (const card of deck) {
      card.set_y(650)
    }
    console.log(selected_card.color+selected_card.number)
    selected_card.change_y(-21)
  }
});

for (const [index, card] of deck.entries()) {
  card.change_x(32*index)
  card.change_y(650)
}

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const card of deck) {
    card.draw_card();
  }
}