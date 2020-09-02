import { Environment } from "./Environment.js";
import { GraphContextMenu } from "./ContextMenus/GraphContextMenu.js";
import { SocketContextMenu } from "./ContextMenus/SocketContextMenu.js";
import { NodeContextMenu } from "./ContextMenus/NodeContextMenu.js";
import { SocketColors } from "./enums.js";
import { Node } from "./node.js";

const GraphState = {
    NONE: 0,
    HIGHLIGHT: 1,
    LOADING: 2,
};

class Graph {
    constructor() {
        //this.data = data;

        this.x = 0;
        this.y = 0;

        this.nodes = [];
        this.connections = new Map();

        this.nx = 0;
        this.ny = 0;

        this.selected = null;

        this.context_menu = null;

        this.state = GraphState.NONE;

        this.canvas = Environment.p5
            .createCanvas(Environment.width, Environment.height)

            .mousePressed(function () {
                if (Environment.p5.mouseButton == Environment.p5.LEFT) {
                    GraphContextMenu.Menu.hide();
                    SocketContextMenu.Menu.hide();
                    NodeContextMenu.Menu.hide();
                }
            })
            .dragOver(function () {
                Environment.graph.state = GraphState.HIGHLIGHT;
            })
            .dragLeave(function () {
                Environment.graph.state = GraphState.NONE;
            })
            .drop(
                function (file) {
                    Environment.graph.state = GraphState.NONE;
                    Environment.graph.load_graph(file.data);
                },
                function () {
                    Environment.graph.state = GraphState.LOADING;
                }
            );

        console.log(this.canvas.position());

        this.canvas.position(0, 0);
    }

    load_graph(json) {
        console.log(json);

        this.nodes = [];

        json.nodes.forEach((node) => {
            var n = new Node(node.position.x, node.position.y, node.name);
            var transputs = Environment.nodeJson[node.name];
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

    add_node(node) {
        node.graph = this;
        node.id = this.nodes.length;
        this.nodes.push(node);
    }

    remove_node(node) {
        let index = this.nodes.indexOf(node);
        console.log(index);
        if (index > -1) {
            node.inputs.forEach((in_socket) =>
                in_socket.connected_sockets.forEach((out_socket) =>
                    this.remove_connection(in_socket, out_socket)
                )
            );
            node.outputs.forEach((out_socket) =>
                out_socket.connected_sockets.forEach((in_socket) =>
                    this.remove_connection(in_socket, out_socket)
                )
            );
            this.nodes.splice(index, 1);
        }
    }

    add_connection(socket_in, socket_out) {
        if (this.connections.has(socket_in))
            this.remove_connection(socket_in, this.connections.get(socket_in));

        this.connections.set(socket_in, socket_out);

        socket_out.connected_sockets.push(socket_in);
        socket_in.connected_sockets.push(socket_out);
    }

    remove_connection(socket_in, socket_out) {
        this.connections.delete(socket_in);

        if (socket_out == null) return;

        let index = socket_out.connected_sockets.findIndex(
            (socket) => socket == socket_in
        );
        if (index > -1) socket_out.connected_sockets.splice(index, 1);

        index = socket_in.connected_sockets.findIndex(
            (socket) => socket == socket_out
        );
        if (index > -1) socket_in.connected_sockets.splice(index, 1);
    }

    draw_grid() {
        Environment.p5.push();
        var gridSize = 200;

        var subGridNumber = 5;
        Environment.p5.stroke(50);

        for (
            var i = this.x % (gridSize / subGridNumber);
            i < Environment.p5.width;
            i += gridSize / subGridNumber
        )
            Environment.p5.line(i, 0, i, Environment.p5.height);

        for (
            var i = this.y % (gridSize / subGridNumber);
            i < Environment.p5.height;
            i += gridSize / subGridNumber
        )
            Environment.p5.line(0, i, Environment.p5.width, i);

        Environment.p5.stroke(150);

        for (var i = this.x % gridSize; i < Environment.p5.width; i += gridSize)
            Environment.p5.line(i, 0, i, Environment.p5.height);

        for (
            var i = this.y % gridSize;
            i < Environment.p5.height;
            i += gridSize
        )
            Environment.p5.line(0, i, Environment.p5.width, i);
        Environment.p5.pop();
    }

    draw_connections() {
        Environment.p5.push();
        Environment.p5.fill(0, 0, 0, 0);
        this.connections.forEach((socket_in, socket_out, i) => {
            Environment.p5.stroke(255);
            Environment.p5.strokeWeight(7);
            Environment.p5.bezier(
                socket_in.x,
                socket_in.y,
                socket_in.x + 100,
                socket_in.y,
                socket_out.x - 100,
                socket_out.y,
                socket_out.x,
                socket_out.y
            );
            Environment.p5.stroke(SocketColors[socket_in.type]);
            Environment.p5.strokeWeight(5);
            Environment.p5.bezier(
                socket_in.x,
                socket_in.y,
                socket_in.x + 100,
                socket_in.y,
                socket_out.x - 100,
                socket_out.y,
                socket_out.x,
                socket_out.y
            );
        });
        Environment.p5.pop();
    }

    draw() {
        Environment.p5.background(0);

        this.draw_grid();

        this.draw_connections();

        this.nodes.forEach((item, i) => {
            item.draw();
        });

        if (this.state == GraphState.HIGHLIGHT) {
            Environment.p5.push();
            Environment.p5.fill(255, 255, 255, 200);
            Environment.p5.rect(0, 0, Environment.width, Environment.height);
            Environment.p5.pop();
        }
    }

    mousePressed() {
        var res = this.nodes.filter((node, i) => node.contains_mouse());

        if (res.length > 0) {
            this.selected = res[0];

            this.selected.mousePressed();
            return;
        }

        if (Environment.p5.mouseButton == Environment.p5.RIGHT) {
            GraphContextMenu.Menu.show();
            return;
        }

        this.nx = Environment.p5.mouseX;
        this.ny = Environment.p5.mouseY;
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

        this.x += Environment.p5.mouseX - this.nx;
        this.nx = Environment.p5.mouseX;
        this.y += Environment.p5.mouseY - this.ny;
        this.ny = Environment.p5.mouseY;
    }
}

export { Graph };
