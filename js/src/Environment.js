import { Graph } from "./Graph.js";
import { SocketContextMenu } from "./ContextMenus/SocketContextMenu.js";
import { NodeContextMenu } from "./ContextMenus/NodeContextMenu.js";
import { GraphContextMenu } from "./ContextMenus/GraphContextMenu.js";

export class Environment {
    static width = 800;
    static height = 500;

    static fontsize = 15;

    static nodeJson;

    static p5;
    static graph;

    constructor(p5) {
        Environment.p5 = p5;

        let font;

        p5.preload = function () {
            font = p5.loadFont("../assets/DejaVuSans.ttf");
            Environment.nodeJson = p5.loadJSON("./nodes.json");
        };

        p5.setup = function () {
            Environment.graph = new Graph();

            p5.textFont(font);
            p5.textSize(Environment.fontsize);

            GraphContextMenu.Menu = new GraphContextMenu();
            NodeContextMenu.Menu = new NodeContextMenu();
            SocketContextMenu.Menu = new SocketContextMenu();
        };

        p5.draw = function () {
            Environment.graph.draw();
        };
        p5.mousePressed = function () {
            Environment.graph.mousePressed();
        };
        p5.mouseReleased = function () {
            Environment.graph.mouseReleased();
        };
        p5.mouseDragged = function () {
            Environment.graph.mouseDragged();
        };
        p5.mouseOver = function () {
            Environment.graph.mouseOver();
        };
        p5.mouseOut = function () {
            Environment.graph.mouseOut();
        };
    }
}
