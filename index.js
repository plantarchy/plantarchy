const log = console.log;
const API_URL = "https://c829-128-210-107-129.ngrok.io"
async function Index() {
    document.getElementById("konva-holder").style.display = "block";
    document.getElementById("signup").style.display = "none";
    const game_code = document.getElementById("game-code").value
    const username = document.getElementById("name-input").value;
    console.log(document.getElementById("name-input").value);
    // const res = await fetch(API_URL + "/games");
    // const data = await res.json();
    // console.log(data)
    const res = await fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        game_code: game_code,
        player_name: username
      })
    });
    if (res.status === 400) {
      alert("Error 400");
    }
    if (res.status === 404) {
      alert("Error 404");
    }
    const data = await res.json();
    console.log(data);
    window.playerID = data.player;
}
const stage = new Konva.Stage({
  height: window.innerHeight,
  width: window.innerWidth,
  container: "konva-holder",
});


const layer = new Konva.Layer();
stage.add(layer);

const GARDEN_X = 50;
const GARDEN_Y = 50;

let garden = new Garden(20,20,50);
// double for to create every grid in the window
for(let w = 0; w < garden.width; w++) {
  for (let h = 0; h < garden.height; h++) {
    const cell = new Konva.Rect({
      x: GARDEN_X + w * garden.cellSize,
      y: GARDEN_Y + h * garden.cellSize,
      fill: "#79e7a4",
      height: garden.cellSize,
      width: garden.cellSize,
      stroke: 'black',
      strokeWidth: 2
    });
    layer.add(cell)
    
    // mouse listeners
    // this.x() / gridSize lets Vincent's DB take it as (1, 0) (17, 11)
    cell.on('click', function () {
      console.log("mouse down", (this.x() - GARDEN_X) / garden.cellSize, (this.y() - GARDEN_Y) / garden.cellSize);
    });
  }

}
