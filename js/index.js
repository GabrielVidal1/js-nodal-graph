import { Graph } from "./graph.js";
import { Node } from "./node.js";
import { TransputType, ValueType } from "./enums.js";

console.log("t");

new p5(function (p5) {
    console.log("start");

    let nodes = [];

    const width = 800;
    const height = 500;

    let font,
        fontsize = 15;

    let graph = new Graph(fontsize);

    let pressed = false;

    let nx = 0;
    let ny = 0;

    p5.mousePressed = function () {
        console.log("mousePressed");

        graph.mousePressed(p5);
    };

    p5.mouseReleased = function () {
        console.log("mouseReleased");
        graph.mouseReleased(p5);
    };

    p5.mouseDragged = function () {
        console.log("mouseDragged");
        graph.mouseDragged(p5);
    };

    p5.preload = function () {
        // Ensure the .ttf or .otf font stored in the assets directory
        // is loaded before setup() and draw() are called
        font = p5.loadFont("../assets/DejaVuSans.ttf");
    };

    p5.setup = function () {
        p5.createCanvas(width, height);
        p5.textFont(font);
        p5.textSize(fontsize);
        graph.add_node(
            new Node(10, 20, "Deal Damage")
                .add_input("Minion", ValueType.MINION)
                .add_input("Damage", ValueType.INTEGER)
                .add_output("Call", ValueType.NONE)
        );
        graph.add_node(
            new Node(150, 20, "Integer").add_output("Value", ValueType.INTEGER)
        );
    };

    p5.draw = function () {
        p5.background(0);
        graph.draw(p5);
    };
});
