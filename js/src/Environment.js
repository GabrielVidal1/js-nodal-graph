import { Graph } from "./Graph.js";
import { SocketContextMenu } from "./ContextMenus/SocketContextMenu.js";
import { NodeContextMenu } from "./ContextMenus/NodeContextMenu.js";
import { GraphContextMenu } from "./ContextMenus/GraphContextMenu.js";
import { MacroUI } from "./MacroUI.js";
import { LayersUI } from "./LayersUI.js";

export class Environment {
    static width = 800;
    static height = 500;

    static fontsize = 15;

    static nodes;

    static p5;
    static graph;

    constructor(p5) {
        Environment.p5 = p5;

        let font;

        p5.preload = function () {
            font = p5.loadFont("../assets/DejaVuSans.ttf");
            Environment.nodes = {
                nodes: p5.loadJSON("./nodes.json"),
                macros: {},
            };
        };

        p5.setup = function () {
            Environment.graph = new Graph();

            p5.textFont(font);
            p5.textSize(Environment.fontsize);

            GraphContextMenu.Menu = new GraphContextMenu();
            NodeContextMenu.Menu = new NodeContextMenu();
            SocketContextMenu.Menu = new SocketContextMenu();
            MacroUI.ui = new MacroUI();

            LayersUI.Update();

            p5.mouseDragged = function () {
                Environment.graph.mouseDragged();
            };
        };

        p5.draw = function () {
            Environment.graph.draw();
        };
    }
}
