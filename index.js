const log = console.log;
function Index() {
    document.getElementById("konva-holder").style.display = "block";
    document.getElementById("signup").style.display = "none";
    console.log(document.getElementById("name-input").value);
}
const stage = new Konva.Stage({
  height: window.innerHeight,
  width: window.innerWidth,
  container: "konva-holder",
});

const layer = new Konva.Layer();
stage.add(layer);

const gridSize = 30;
// double for to create every grid in the window
for(w = 0; w < window.innerWidth; w += gridSize) {
  for (h = 0; h < window.innerHeight; h += gridSize) {
    const grid = new Konva.Rect({
      x: w,
      y: h,
      fill: "#79e7a4",
      height: gridSize,
      width: gridSize,
    });
    layer.add(grid)

    // adds horizontal line
    const horizontalLine = new Konva.Line({
      points: [0, h, window.innerWidth, h],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    })
    layer.add(horizontalLine)
    

    // mouse listeners
    // this.x() / gridSize lets Vincent's DB take it as (1, 0) (17, 11)
    grid.on('mousedown', function () {
      console.log("mouse down", this.x() / gridSize, this.y() / gridSize);
    });
    grid.on('mouseup', function () {
      console.log("mouse up", this.x() / gridSize, this.y() / gridSize);
    });
  }
  // adds vertical line for separation
  const verticalLine = new Konva.Line({
    points: [w, 0, w, window.innerHeight],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  })
  layer.add(verticalLine)

}
