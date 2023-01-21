const log = console.log;

const stage = new Konva.Stage({
  height: window.innerHeight,
  width: window.innerWidth,
  container: "konva-holder",
});

const layer = new Konva.Layer();
stage.add(layer);


const rect = new Konva.Rect({
  x: 50,
  y: 50,
  fill: "blue",
  height: 100,
  width: 200,
});

layer.add(rect)

