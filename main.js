//F5 to preview page
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const img = new Image();

class Card {
  constructor(spritesheet, sprite_img_data, col_num) {
    this.spritesheet = spritesheet;
    this.sprite_img_data = sprite_img_data;
    this.color = col_num.slice(0, 1);
    this.number = col_num.slice(1);
    this.x_pos = 0;
    this.y_pos = 0;
  }

  draw_card() {
    ctx.drawImage(
      this.spritesheet,
      sprite_img_data[this.color][this.color+this.number][0],
      sprite_img_data[this.color][this.color+this.number][1],
      32,
      42,
      this.x_pos,
      this.y_pos,
      64,
      84
    );
  }

  change_x(num) {
    this.x_pos = this.x_pos + num;
  }

  change_y(num) {
    this.y_pos = this.y_pos + num;
  }

  set_y(num) {
    this.y_pos = num
  }
}

function generate_random_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gen_sprite_img_data() {
  let data = {};
  let row_names = ['R', 'B', 'Y', 'G'];
  let card_names = ['S', 'R', 'P2'];
  let last_row = ['BACKSIDE', 'W', 'WP4'];
  for (let row = 0; row < 5; row++) {
    if (row == 4) {
      temp_data={};
      for (let col = 0; col < 3; col++) {
        temp_data[last_row[col]] = [32*col, 42*row];
      }
      data["W"] = temp_data;
    } else {
      temp_data={};
      for (let col = 0; col < 13; col++) {
        if (col > 9) {
          temp_data[row_names[row]+card_names[col-10]] = [32*col, 42*row];
        } else {
          temp_data[row_names[row]+col] = [32*col, 42*row];
        }
      }
      data[row_names[row]] = temp_data;
    }
  }
  return data;
}

let sprite_img_data=gen_sprite_img_data();

function gen_str_deck() {
  let deck = [];
  card_names = ['S', 'R', 'P2'];
  for (const color in sprite_img_data) {
    if (color == "W") {
      for (let i = 0; i < 4; i++) {
        deck.push(color);
        deck.push(color+"P4");
      }
    } else {
      for (let i = 0; i < 13; i++) {
        if (i > 9) {
          deck.push(color+card_names[i-10]);
        } else {
          deck.push(color+i);
        }
      }
      for (let i = 1; i < 13; i++) {
        if (i > 9) {
          deck.push(color+card_names[i-10]);
        } else {
          deck.push(color+i);
        }
      }
    }
  }
  return deck;
}

let str_deck = gen_str_deck();

function gen_deck() {
  let deck = [];
  for (let i = 0; i < str_deck.length; i++) {
    deck.push(new Card(img, sprite_img_data, str_deck[i]));
  }
  return deck;
}

let deck = gen_deck();

function shuffle_deck(deck) {
  for (let i = 0; i < 1000; i++) {
    card_pos_a = generate_random_int(0, deck.length)
    card_pos_b = generate_random_int(0, deck.length)
    temp = deck[card_pos_a]
    deck[card_pos_a] = deck[card_pos_b]
    deck[card_pos_b] = temp
  }
  return deck
}

deck = shuffle_deck(deck)

function get_mouse_pos(event) {
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