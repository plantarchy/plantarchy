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

// STAGE
const stage = new Konva.Stage({
  height: window.innerHeight,
  width: window.innerWidth,
  container: "konva-holder",
});


// LAYER
const layer = new Konva.Layer();
stage.add(layer);
// const for the grid
const GARDEN_X = 50;
const GARDEN_Y = 50;

// GRID GROUP
const gridGroup = new Konva.Group({
  draggable: true,
});
layer.add(gridGroup);


let garden = new Garden(35,35,25);
window.garden = garden;
// double for to create every grid in the window

async function init() {

  socket.on(window.gameID + "/update_tile", update);
  const res = await fetch(API_URL + "/get_tiles?game_id="+window.gameID);
  const data = await res.json();

  for (let i = 0; i < data.length; i++) {
    if (data[i].crop != 0) {
      garden.grid[data[i].x_coord][data[i].y_coord] = new Plant(data[i].player_uuid, data[i].crop);
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

      gridGroup.add(cell);

      if (garden.grid[w][h] == null) {
        garden.grid[w][h] = new Plant("", 0, cell);
        garden.grid[w][h].cell = cell;
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
        if (garden.grid[cellX][cellY].crop == 4) {
          const res = await fetch(API_URL + "/pick_berry", {
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
            })
          });
        } else {
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
              crop: 2
            })
          });
          if (res.status === 404) {
            alert("Error 404: User or tile not found"); //HANDLE
          }
          if (res.status === 418) {
            alert("No seeds");
          }
          const data = await res.json();
          console.log(data);
        }
      });
      layer.add(gridGroup)
    }
  }
  layer.draw();
}


function update(tile) {
  // console.log("TILE", tile, garden.grid)
  garden.grid[tile.x_coord][tile.y_coord].owner = tile.player_uuid;
  garden.grid[tile.x_coord][tile.y_coord].setCrop(tile.crop);
  garden.grid[tile.x_coord][tile.y_coord].cell.draw();
  // console.log("Got update!", tile.x_coord, tile.y_coord)
}

const textlayer = new Konva.Layer();

// BERRY TEXT
const berryText = new Konva.Text({
  x: 20,
  y: 20,
  fontSize: 15,
  text: "Berry count: ",
});
textlayer.add(berryText);

textlayer.visible(true);
layer.visible(true);

// SEED TEXT
const seedText = new Konva.Text({
  x: window.innerWidth - 175,
  y: 20,
  fontSize: 15,
  text: "Available seeds: ",
});
textlayer.add(seedText);




stage.add(textlayer);

textlayer.draw();



// Allows user to zoom in and out
const maxScale = 5;
const minScale = 0.5;

var scaleBy = 1.05;
      stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        var oldScale = stage.scaleX();
        var pointer = stage.getPointerPosition();

        var mousePointTo = {
          x: (pointer.x - gridGroup.x()) / oldScale,
          y: (pointer.y - gridGroup.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
          direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        newScale = Math.max(Math.min(newScale, maxScale), minScale);

        stage.scale({ x: newScale, y: newScale });

        var newX = text.x() * newScale/oldScale;
        var newY = text.y() * newScale/oldScale;
        text.x(newX);
        text.y(newY);

        var newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        gridGroup.position(newPos);
      });
