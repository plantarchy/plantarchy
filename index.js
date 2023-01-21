const log = console.log;

const stage = new Konva.Stage({
  height: window.innerHeight,
  width: window.innerWidth,
  container: "konva-holder",
});

const layer = new Konva.Layer();
stage.add(layer);



for(w = 0; w < window.innerWidth; w += 30) {
  for (h = 0; h < window.innerHeight; h += 30) {
    const grid = new Konva.Rect({
      x: w,
      y: h,
      fill: "#79e7a4",
      height: 100,
      width: 2000,
    });
    layer.add(grid)
    const horizontalLine = new Konva.Line({
      points: [0, h, window.innerWidth, h],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    })
    layer.add(horizontalLine)
    
  }
  const verticalLine = new Konva.Line({
    points: [w, 0, w, window.innerHeight],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  })
  layer.add(verticalLine)
}

