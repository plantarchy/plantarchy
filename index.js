const socket = io("wss://c829-128-210-107-129.ngrok.io");
socket.on('connect', () => {
  window.socketID = socket.id;
})
const HARVEST_COOLDOWN = 20;
const log = console.log;
const API_URL = "https://c829-128-210-107-129.ngrok.io"

let bombMode = false;
let berries = 0;
let seeds = 5;
let harvest_cooldown = HARVEST_COOLDOWN;

async function Index() {
  document.getElementById("konva-holder").style.display = "block";
  document.getElementById("signup").style.display = "none";
  
  //document.getElementById("body").style.backgroundColor = "#774820"#79e7a4 green
  //document.getElementById("body").style.backgroundColor = "#774820" brown

  document.getElementById("body").style.backgroundColor = "#79e7a4" 
  document.getElementById("berrypic").style.display = "block";
  document.getElementById("seedpic").style.display = "block";

  document.getElementById("extract").style.display = "block";
  document.getElementById("fertilize").style.display = "block";
  document.getElementById("harvest").style.display = "block";
  document.getElementById("berrybomb").style.display = "block";
  document.getElementById("leaderboard").style.display = "block";

  let crosshair = document.getElementById('crosshair');
  const onMouseMove = (e) =>{
    crosshair.style.left = e.pageX + 'px';
    crosshair.style.top = e.pageY + 'px';
  }
  document.addEventListener('mousemove', onMouseMove);

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
      player_name: username,
      socket_sid: window.socketID
    })
  });
  if (res.status === 400) {
    alert("Error 400");
  }
  if (res.status === 404) {
    window.location.replace("/plantarchy.html");
  }
  const data = await res.json();
  console.log(data);
  window.gameID = data.game_id;
  window.playerID = data.player;

  const intervalID = setInterval(myCallback, 100)

  await init();
}

// STAGE
const stage = new Konva.Stage({
  height: window.innerHeight,
  width: window.innerWidth,
  container: "konva-holder",
});
console.log("HEIGHT:", window.innerHeight)


// LAYER
const layer = new Konva.Layer({
  x: Math.floor(window.innerWidth*0.25),
  y: 50,
});
stage.add(layer);
// const for the grid
const GARDEN_X = 0;
const GARDEN_Y = 0;

// GRID GROUP
const gridGroup = new Konva.Group();
layer.add(gridGroup);


let garden = new Garden(35,35,Math.floor(window.innerHeight/40));
window.garden = garden;
// double for to create every grid in the window



var textlayer = new Konva.Layer();

// BERRY TEXT
const berryText = new Konva.Text({
  x: 150,
  y: 110,
  fontSize: 50,
  text: "X ",
  fontStyle: "bold",
});
textlayer.add(berryText);

textlayer.visible(true);
layer.visible(true);

// SEED TEXT
const seedText = new Konva.Text({
  x: 150,
  y: 320,
  fontSize: 50,
  text: "X ",
  fontStyle: "bold",
});
textlayer.add(seedText);

stage.add(textlayer);

textlayer.draw();



async function init() {

  socket.on(window.gameID + "/update_tile", update);
  socket.on("new_player", handleNewPlayer);
  socket.on("disconnect_player", handleLeavePlayer);

  // Fetch all players
  let res = await fetch(API_URL + "/get_users?game_id="+window.gameID);
  let data = await res.json();
  for (let player of data) {
    handleNewPlayer(player);
  }

  res = await fetch(API_URL + "/get_tiles?game_id="+window.gameID);
  data = await res.json();

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
        console.log(bombMode);
        if (bombMode == true) {
          console.log("bomb");
          const res = await fetch(API_URL + "/berry_bomb", {
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
          if (res === 403) {
            document.getElementById("berrypic").classList.add("shake");
            var millisecondsToWait = 300;
            setTimeout(function() {
              document.getElementById("berrypic").classList.remove("shake");

            }, millisecondsToWait);
          }
          document.getElementById('crosshair').style.visibility = "hidden";
          bombMode = false;
        } else {
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
            if (res.status === 418) {
              document.getElementById("seedpic").classList.add("shake-trigger");
              var millisecondsToWait = 600;
              setTimeout(function() {
                document.getElementById("seedpic").classList.remove("shake-trigger");
          
              }, millisecondsToWait);
            }
            if (res.status === 404) {
              window.location.replace("/plantarchy.html");
            }
            const data = await res.json();
            // console.log(data);
          }
        }
      });
      layer.add(gridGroup)
    }
  }
  layer.draw();
}

function handleNewPlayer(player) {
  console.log("New Player", player)
  if (player.id == window.playerID) return;

  let id = player.playerID;
  let index = Math.floor(Math.random() * OTHERS.length);
  let colors = OTHERS[index];
  HUE_MAPPING[player.id] = colors;
  OTHERS.splice(index, 1);
  window.HUE_MAPPING = HUE_MAPPING;
}

function handleLeavePlayer(player) {
  let id = player.id;

  let hue = HUE_MAPPING[player.id];
  delete HUE_MAPPING[player.id];
  OTHERS.push(hue);
}

function update(tile) {
  // console.log("TILE", tile, garden.grid)
  garden.grid[tile.x_coord][tile.y_coord].owner = tile.player_uuid;
  garden.grid[tile.x_coord][tile.y_coord].setCrop(tile.crop);
  garden.grid[tile.x_coord][tile.y_coord].cell.draw();
  // console.log("Got update!", tile.x_coord, tile.y_coord)
}

let land = 0;
let username = "";

async function myCallback() {
  const res = await fetch(API_URL + "/get_user?player_id=" + window.playerID, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
  });
  const data = await res.json();

  if (data.seeds == undefined) {
    seedText.setText("x0");
  } else {
    seedText.setText("x" + data.seeds);
    seeds = data.seeds;
  }
  if (data.berries == undefined) {
    berryText.setText("x0");
  } else {
    berryText.setText("x" + data.berries);
    berries = data.berries;
  }

  harvest_cooldown = data.harvest_cooldown;
  if (harvest_cooldown == 0) {
    document.getElementById("harvest").style.backgroundColor = "#fad400";
  } else {
    document.getElementById("harvest").style.backgroundColor = "#6e5d00";
  }

  username = data.player_name || "You";
  land = data.land || 0;

  textlayer.draw();  
}

setInterval(async () => {
  if (!window.gameID) return;
  const res = await fetch(API_URL + "/get_users?game_id=" + window.gameID, {
    method: "GET",
  });
  const data = await res.json();
  data.sort((a, b) => (b.land - a.land))
  let displaySelf = false;
  for (let i = 0; i < 4; i++) {
    const name = document.getElementById("name" + (i+1));
    const score = document.getElementById("score" + (i+1));
    if (i >= data.length) {
      name.innerText = "";
      score.innerText = "";
      name.parentNode.style.backgroundColor = "#FFF";
      continue;
    };
    console.log("name" + (i+1), "score" + (i+1))
    if (data[i].player_name === username) {
      displaySelf = false;
    };
    name.innerText = data[i].player_name;
    console.log(HUE_MAPPING[data[i].id]?.[1])
    name.style.color = "#FFF";
    score.style.color = "#FFF";
    name.parentNode.style.backgroundColor = HUE_MAPPING[data[i].id]?.[1] || YOU[1];
    score.innerText = data[i].land;
  }

  if (displaySelf) {
    const name = document.getElementById("name5");
    const score = document.getElementById("score5");
    name.innerText = username;
    score.innerText = land;
  }
}, 1000)

setInterval(() => {
  socket.emit("ping", {
    "player_id": window.playerID,
    "game_id": window.gameID
  })
}, 500)

// EXTRACT
async function extract() {
  const res = await fetch(API_URL + "/extract", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      player_uuid: window.playerID,
      game_uuid: window.gameID,
    })
  });
  const data = await res.json();

  if (res.status === 403) {
    console.log(res.status);
    document.getElementById("berrypic").classList.add("shake-trigger");
    var millisecondsToWait = 600;
    setTimeout(function() {
      document.getElementById("berrypic").classList.remove("shake-trigger");

    }, millisecondsToWait);
  }
}
//  HARVEST
async function harvest() {
  if (harvest_cooldown == 0) {
    const res = await fetch(API_URL + "/harvest", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        player_uuid: window.playerID,
        game_uuid: window.gameID,
      })
    });
    const data = await res.json();
  
    if (res.status === 403) {
      console.log(res.status);
      document.getElementById("berrypic").classList.add("shake-trigger");
      var millisecondsToWait = 600;
      setTimeout(function() {
        document.getElementById("berrypic").classList.remove("shake-trigger");
  
      }, millisecondsToWait);
    }
  }
}
// FERTILIZE
async function fertilize() {
  const res = await fetch(API_URL + "/fertilize", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      player_uuid: window.playerID,
      game_uuid: window.gameID,
    })
  });
  const data = await res.json();

  console.log(res.status);
  if (res.status === 403) {
    console.log(res.status);
    document.getElementById("berrypic").classList.add("shake-trigger");
    var millisecondsToWait = 600;
    setTimeout(function() {
      document.getElementById("berrypic").classList.remove("shake-trigger");

    }, millisecondsToWait);
  }
}


async function berrybomb() {
  if (berries >= 15) {
    bombMode = true;
    document.getElementById("crosshair").style.display = "block";
    document.getElementById("crosshair").style.visibility = "visible";
  } else {
    document.getElementById("berrypic").classList.add("shake-trigger");
    var millisecondsToWait = 600;
    setTimeout(function() {
      document.getElementById("berrypic").classList.remove("shake-trigger");

    }, millisecondsToWait);
  }
}