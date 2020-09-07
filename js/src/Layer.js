import { Environment } from "./Environment.js";
import { Node } from "./Node.js";
import { MacroTransput } from "./Macro.js";
import { SocketColors } from "./Enums.js";

class Layer {
    constructor(name) {
        this.x = 0;
        this.y = 0;

        this.previous_layer = null;

        this.name = name;

        this.nodes = [];
        this.connections = new Map();
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

    draw_nodes() {
        this.nodes.forEach((item, i) => {
            item.draw();
        });
    }

    draw() {
        this.draw_connections();
        this.draw_nodes();
    }

    serialize() {
        return {
            nodes: this.nodes.map((node) => {
                var res = {
                    name: node.name,
                    position: { x: node.x, y: node.y },
                };
                if (node.data.length > 0) res["data"] = node.data.map();
                return res;
            }),
            connections: Array.from(this.connections, ([key, value]) => {
                return (
                    key.node.id +
                    " " +
                    key.index +
                    " " +
                    value.node.id +
                    " " +
                    value.index
                );
            }),
        };
    }
}

class MacroLayer extends Layer {
    constructor(macro) {
        super(macro.name);

        this.add_node(
            (this.in_node = new MacroTransput(0, 0, "Inputs", macro))
        );
        this.add_node(
            (this.out_node = new MacroTransput(300, 0, "Outputs", macro))
        );
    }
}

export { Layer, MacroLayer };
