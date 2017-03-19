// module aliases
var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    World = Matter.World;

var engine,
    world,
    boxes = [];

function setup() {
    createCanvas(400, 400);
    canvas.parent('sketch-holder');
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);
    var options = {
      isStatic: true
    }
    ground = Bodies.rectangle(200, height, width, 10, options);
    World.add(world, ground);
}

function mouseDragged() {
  boxes.push(new Box(mouseX, mouseY, 20, 20));
}

function draw() {
    background(51);
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].show();
    }
}
