// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Query = Matter.Query,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies;

Matter.use(MatterAttractors);

var createCanvas = function () {

  var canvas = document.getElementById('canvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

    // create engine
  var engine = Engine.create({
    render: {
      canvas: canvas
    }
  }),
      world = engine.world;
  
  window.addEventListener("resize", function(){
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
  });

    
    // run the engine
  Engine.run(engine);
   
    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: Math.min(document.documentElement.clientWidth, 800),
            height: Math.min(document.documentElement.clientHeight, 600),
                        showVelocity: true,
            showAngleIndicator: true,
            pixelRatio: 1,
            background: '#000',
            wireframeBackground: '#000',
            hasBounds: false,
            enabled: true,
            wireframes: false,
            showSleeping: true,
            showDebug: false,
            showBroadphase: false,
            showBounds: false,
            showVelocity: false,
            showCollisions: false,
            showSeparations: false,
            showAxes: false,
            showPositions: false,
            showIds: false,
            showShadows: false,
            showVertexNumbers: false,
            showConvexHulls: false,
            showInternalEdges: false,
            showMousePosition: false
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var terrain;

    $.get('./svg/terrain.svg').done(function(data) {
        var vertexSets = [];

        $(data).find('path').each(function(i, path) {
            vertexSets.push(Svg.pathToVertices(path, 30));
        });

        terrain = Bodies.fromVertices(400, 350, vertexSets, {
            isStatic: true,
            render: {
                fillStyle: '#2e2b44',
                strokeStyle: '#2e2b44',
                lineWidth: 1
            }
        }, true);

        World.add(world, terrain);

        var bodyOptions = {
            frictionAir: 0, 
            friction: 0.0001,
            restitution: 0.6
        };
        
        World.add(world, Composites.stack(80, 100, 20, 20, 10, 10, function(x, y) {
            if (Query.point([terrain], { x: x, y: y }).length === 0) {
                return Bodies.polygon(x, y, 5, 12, bodyOptions);
            }
        }));
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};