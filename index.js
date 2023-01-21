const socket = io("wss://c829-128-210-107-129.ngrok.io");
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
  window.gameID = data.game_id;
  window.playerID = data.player;

  await init();
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
window.garden = garden;
// double for to create every grid in the window

async function init() {

  socket.on(window.gameID + "/update_tile", update);
  const res = await fetch(API_URL + "/get_tiles?game_id="+window.gameID);
  const data = await res.json();

  for (let i = 0; i < data.length; i++) {
    if (data[i].crop != 0) {
      garden.grid[data[i].x_coord][data[i].y_coord] = new Plant(data[i].crop);
    }
  }

  for (let w = 0; w < garden.width; w++) {
    for (let h = 0; h < garden.height; h++) {

      const cell = new Konva.Rect({
        x: GARDEN_X + w * garden.cellSize,
        y: GARDEN_Y + h * garden.cellSize,
        fill: "#ffffff",
        height: garden.cellSize,
        width: garden.cellSize,
        stroke: 'black',
        strokeWidth: 2
      });
      if (garden.grid[w][h] == null) {
        garden.grid[w][h] = new Plant(0, cell);
        garden.grid[w][h].setCrop(garden.grid[w][h].crop);
      } else {
        garden.grid[w][h].cell = cell;
        garden.grid[w][h].setCrop(garden.grid[w][h].crop);
      }

      // mouse listeners
      // this.x() / gridSize lets Vincent's DB take it as (1, 0) (17, 11)
      cell.on('click', async function () {
        cellX = (this.x() - GARDEN_X) / garden.cellSize;
        cellY = (this.y() - GARDEN_Y) / garden.cellSize
        console.log("mouse down", cellX, cellY);


        const res = await fetch(API_URL + "/set_tile", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            x: cellX,
            y: cellY,
            player_uuid: window.playerID,
            game_uuid: window.gameID,
            crop: 1
          })
        });
        if (res.status === 404) {
          alert("Error 404: User or tile not found"); //HANDLE
        }
        if (res.status === 403) {
          alert("Tile already occupied");
        }
        const data = await res.json();
        console.log(data);

      });
      layer.add(cell)
    }
  }
  layer.draw();
}

function update(tile) {
  console.log("TILE", tile, garden.grid)
  garden.grid[tile.x_coord][tile.y_coord].setCrop(tile.crop);
}


var scaleBy = 1.01;
      stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        var oldScale = stage.scaleX();
        var pointer = stage.getPointerPosition();

        var mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
          direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        var newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
      });
