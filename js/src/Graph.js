import { Environment } from "./Environment.js";
import { GraphContextMenu } from "./ContextMenus/GraphContextMenu.js";
import { SocketContextMenu } from "./ContextMenus/SocketContextMenu.js";
import { NodeContextMenu } from "./ContextMenus/NodeContextMenu.js";
import { Node } from "./Node.js";
import { Layer } from "./Layer.js";
import { LayersUI } from "./LayersUI.js";

const GraphState = {
    NONE: 0,
    HIGHLIGHT: 1,
    LOADING: 2,
};

let nx = 0,
    ny = 0;

class Graph {
    static MainLayer;

    constructor() {
        Graph.MainLayer = new Layer("Main");
        this.selectedLayer = Graph.MainLayer;

        //LayersUI.Update();

        this.selected = null;

        this.layer = this.state = GraphState.NONE;

        this.canvas = Environment.p5.createCanvas(
            Environment.width,
            Environment.height
        );

        this.canvas.mousePressed(function () {
            Environment.graph.mousePressed();
        });
        this.canvas.mouseReleased(function () {
            Environment.graph.mouseReleased();
        });

        this.canvas.dragOver(function () {
            Environment.graph.state = GraphState.HIGHLIGHT;
        });
        this.canvas.dragLeave(function () {
            Environment.graph.state = GraphState.NONE;
        });
        this.canvas.drop(
            function (file) {
                Environment.graph.state = GraphState.NONE;
                Environment.graph.load_graph(file.data);
            },
            function () {
                Environment.graph.state = GraphState.LOADING;
            }
        );

        this.canvas.position(0, 0);
    }

    get x() {
        return this.selectedLayer.x;
    }

    get y() {
        return this.selectedLayer.y;
    }

    open_layer(layer) {
        layer.previous_layer = this.selectedLayer;
        this.selectedLayer = layer;

        LayersUI.Update();
    }

    load_graph(json) {
        console.log(json);

        this.nodes = [];

        if ("macros" in json) {
            Environment.nodes.macros = json.macros;
        }

        json.nodes.forEach((node) => {
            var n = new Node(node.position.x, node.position.y, node.name);
            var transputs =
                node.name in Object.keys(Environment.nodes.nodes)
                    ? Environment.nodes.nodes[node.name]
                    : Environment.nodes.macros[node.name];
            transputs.inputs.forEach((input) => {
                n.add_input(input.name, input.type);
            });
            transputs.outputs.forEach((output) => {
                n.add_output(output.name, output.type);
            });

            this.add_node(n);
        });

        this.connections = new Map();

        json.connections.forEach((connection) => {
            const e = connection.split(" ");
            this.add_connection(
                this.nodes[+e[0]].inputs[+e[1]],
                this.nodes[+e[2]].outputs[+e[3]]
            );
        });
    }

    //#region Graph Manipulation

    add_node(node) {
        this.selectedLayer.add_node(node);
    }

    remove_node(node) {
        this.selectedLayer.remove_node(node);
    }

    add_connection(socket_in, socket_out) {
        this.selectedLayer.add_connection(socket_in, socket_out);
    }

    remove_connection(socket_in, socket_out) {
        this.selectedLayer.remove_connection(socket_in, socket_out);
    }

    //#endregion

    //#region Draw

    draw_grid() {
        Environment.p5.push();
        var gridSize = 200;

        var subGridNumber = 5;
        Environment.p5.stroke(50);

        for (
            var i = this.selectedLayer.x % (gridSize / subGridNumber);
            i < Environment.p5.width;
            i += gridSize / subGridNumber
        )
            Environment.p5.line(i, 0, i, Environment.p5.height);

        for (
            var i = this.selectedLayer.y % (gridSize / subGridNumber);
            i < Environment.p5.height;
            i += gridSize / subGridNumber
        )
            Environment.p5.line(0, i, Environment.p5.width, i);

        Environment.p5.stroke(150);

        for (
            var i = this.selectedLayer.x % gridSize;
            i < Environment.p5.width;
            i += gridSize
        )
            Environment.p5.line(i, 0, i, Environment.p5.height);

        for (
            var i = this.selectedLayer.y % gridSize;
            i < Environment.p5.height;
            i += gridSize
        )
            Environment.p5.line(0, i, Environment.p5.width, i);
        Environment.p5.pop();
    }

    draw() {
        Environment.p5.background(0);

        this.draw_grid();

        this.selectedLayer.draw();

        if (this.state == GraphState.HIGHLIGHT) {
            Environment.p5.push();
            Environment.p5.fill(255, 255, 255, 200);
            Environment.p5.rect(0, 0, Environment.width, Environment.height);
            Environment.p5.pop();
        }
    }

    //#endregion

    //#region Mouse Manipulation

    mousePressed() {
        if (Environment.p5.mouseButton == Environment.p5.LEFT) {
            GraphContextMenu.Menu.hide();
            SocketContextMenu.Menu.hide();
            NodeContextMenu.Menu.hide();
        }

        var res = this.selectedLayer.nodes.filter((node, i) =>
            node.contains_mouse()
        );

        if (res.length > 0) {
            this.selected = res[0];

            this.selected.mousePressed();
            return;
        }

        if (Environment.p5.mouseButton == Environment.p5.RIGHT) {
            GraphContextMenu.Menu.show();
            return;
        }

        nx = Environment.p5.mouseX;
        ny = Environment.p5.mouseY;
    }

    mouseReleased() {
        if (this.selected != null) {
            this.selected.mouseReleased();
        }
        this.selected = null;
    }

    mouseDragged() {
        if (Environment.p5.mouseButton == p5.RIGHT) return;

        if (this.selected != null) {
            this.selected.mouseDragged();

            return;
        }

        this.selectedLayer.x += Environment.p5.mouseX - nx;
        nx = Environment.p5.mouseX;
        this.selectedLayer.y += Environment.p5.mouseY - ny;
        ny = Environment.p5.mouseY;
    }

    //#endregion
}

export { Graph };
