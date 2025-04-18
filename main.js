//F5 to preview page
const ctx = document.getElementById("canvas").getContext("2d");
const img = new Image();

function gen_sprite_img_data() {
  data = {}
  row_names = ['RED', 'BLUE', 'YELLOW', 'GREEN']
  card_names = ['S', 'R', 'P2']
  last_row = ['BACKSIDE', 'WILD', 'WILDP4']
  for (let row = 0; row < 5; row++) {
    if (row == 4) {
      for (let col = 0; col < 3; col++) {
        data[last_row[col]] = [32*col, 42*row, 0, 0]
      }
    } else {
      for (let col = 0; col < 13; col++) {
        if (col > 9) {
          data[row_names[row]+card_names[col-10]] = [32*col, 42*row, 0, 0]
        } else {
          data[row_names[row]+col] = [32*col, 42*row, 0, 0]
        }
      }
    }
  }
  return data
}

let sprite_img_data=gen_sprite_img_data()

img.onload = function() {
  for (const key in sprite_img_data) {
    ctx.drawImage(
      img,
      sprite_img_data[key][0],
      sprite_img_data[key][1],
      32,
      42,
      sprite_img_data[key][0]*2,
      sprite_img_data[key][1]*2,
      64,
      84
    )
  }
}

console.log(sprite_img_data)

img.src = "uno-cards.png";
ctx.imageSmoothingEnabled= false;

let intervalLoop = setInterval(main, 10);

function main() {

}