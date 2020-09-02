import { Environment } from "./Environment.js";
import { NodeContextMenu } from "./ContextMenus/NodeContextMenu.js";
import { SocketContextMenu } from "./ContextMenus/SocketContextMenu.js";
import { Socket } from "./socket.js";
import { TransputType, SocketColors } from "./enums.js";

class Node {
    static NodeContextMenu;

    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;

        this.id;

        this.inputs = [];
        this.outputs = [];

        this.offset = 10;

        this.width;
        this.height;

        this.nx = 0;
        this.ny = 0;

        this.selected = null;

        Node.NodeContextMenu = new NodeContextMenu();
    }

    add_input(name, type) {
        this.inputs.push(
            new Socket(this, name, TransputType.INPUT, type).set_index(
                this.inputs.length
            )
        );
        return this;
    }

    add_output(name, type) {
        this.outputs.push(
            new Socket(this, name, TransputType.OUTPUT, type).set_index(
                this.outputs.length
            )
        );
        return this;
    }

    contains_mouse() {
        return (
            Environment.p5.mouseX > this.x + Environment.graph.x &&
            Environment.p5.mouseX < this.x + Environment.graph.x + this.width &&
            Environment.p5.mouseY > this.y + Environment.graph.y &&
            Environment.p5.mouseY < this.y + Environment.graph.y + this.height
        );
    }

    draw() {
        this.width =
            10 +
            2 * this.offset +
            Environment.p5.textWidth(this.name + " Node");
        this.height =
            2 * this.offset +
            (Environment.fontsize + 10) *
                (1 + this.inputs.length + this.outputs.length);

        var witdh = this.width - 2 * this.offset;

        Environment.p5.fill(200, 0, 0);
        Environment.p5.rect(
            Environment.graph.x + this.x + this.offset,
            Environment.graph.y + this.y + this.offset,
            witdh,
            this.height - 2 * this.offset
        );

        Environment.p5.fill(120, 0, 0);
        Environment.p5.rect(
            Environment.graph.x + this.x + this.offset,
            Environment.graph.y + this.y + this.offset,
            witdh,
            Environment.fontsize + 10
        );

        Environment.p5.textAlign(Environment.p5.CENTER, Environment.p5.CENTER);

        Environment.p5.fill(255);
        Environment.p5.text(
            this.name + " Node",
            Environment.graph.x + this.x + this.width / 2,
            Environment.graph.y +
                this.y +
                this.offset +
                5 +
                Environment.fontsize / 2
        );

        var blockHeight = Environment.fontsize + 10;

        this.inputs.forEach((socket, i) => {
            var x = Environment.graph.x + this.x + this.offset;
            var y =
                Environment.graph.y +
                this.y +
                this.offset +
                (i + 1) * (Environment.fontsize + 10);
            Environment.p5.fill(80, 0, 0);
            Environment.p5.rect(x, y, witdh, blockHeight);
            Environment.p5.textAlign(
                Environment.p5.LEFT,
                Environment.p5.CENTER
            );
            Environment.p5.fill(255);
            Environment.p5.text(socket.name, x + 15, y + blockHeight / 2);
            socket.draw(x, y + blockHeight / 2, 15);
        });

        this.outputs.forEach((socket, i) => {
            var x = Environment.graph.x + this.x + this.offset;
            var y =
                Environment.graph.y +
                this.y +
                this.offset +
                (i + 1 + this.inputs.length) * (Environment.fontsize + 10);

            Environment.p5.fill(80, 0, 0);
            Environment.p5.rect(x, y, witdh, blockHeight);
            Environment.p5.textAlign(
                Environment.p5.RIGHT,
                Environment.p5.CENTER
            );
            Environment.p5.fill(255);
            Environment.p5.text(
                socket.name,
                x + this.width - 2 * this.offset - 15,
                y + blockHeight / 2
            );
            socket.draw(
                x + this.width - 2 * this.offset,
                y + blockHeight / 2,
                15
            );
        });

        if (this.selected != null) {
            Environment.p5.push();
            Environment.p5.fill(0, 0, 0, 0);
            Environment.p5.stroke(255);
            Environment.p5.strokeWeight(7);
            Environment.p5.bezier(
                this.selected.x,
                this.selected.y,
                this.selected.x +
                    (this.selected.transput_type == TransputType.OUTPUT
                        ? 100
                        : -100),
                this.selected.y,
                Environment.p5.mouseX,
                Environment.p5.mouseY,
                Environment.p5.mouseX,
                Environment.p5.mouseY
            );
            Environment.p5.strokeWeight(5);
            Environment.p5.stroke(SocketColors[this.selected.type]);
            Environment.p5.bezier(
                this.selected.x,
                this.selected.y,
                this.selected.x +
                    (this.selected.transput_type == TransputType.OUTPUT
                        ? 100
                        : -100),
                this.selected.y,
                Environment.p5.mouseX,
                Environment.p5.mouseY,
                Environment.p5.mouseX,
                Environment.p5.mouseY
            );
            Environment.p5.pop();
            return;
        }
    }

    mousePressed() {
        var sockets = this.inputs
            .concat(this.outputs)
            .filter((socket) => socket.contains_mouse());

        if (sockets.length > 0) {
            if (Environment.p5.mouseButton == Environment.p5.RIGHT) {
                SocketContextMenu.Menu.show(sockets[0]);
                return;
            }
            this.selected = sockets[0];
            return;
        }

        if (Environment.p5.mouseButton == Environment.p5.RIGHT) {
            NodeContextMenu.Menu.show(this);
            return;
        }

        this.nx = Environment.p5.mouseX;
        this.ny = Environment.p5.mouseY;
    }

    mouseReleased() {
        if (this.selected != null) {
            var sockets = Environment.graph.nodes
                .filter((node) => node.contains_mouse(p5))
                .flatMap((node) => node.inputs.concat(node.outputs))
                .filter((socket) => socket.contains_mouse(p5));
            if (sockets.length > 0) {
                if (this.selected.can_connect(sockets[0])) {
                    let socket_in =
                        this.selected.transput_type == TransputType.INPUT
                            ? this.selected
                            : sockets[0];
                    let socket_out =
                        this.selected.transput_type == TransputType.OUTPUT
                            ? this.selected
                            : sockets[0];
                    Environment.graph.add_connection(socket_in, socket_out);
                }
            } else {
                if (this.selected.transput_type == TransputType.INPUT) {
                    Environment.graph.remove_connection(this.selected, null);
                }
            }
        }
        this.selected = null;
    }

    mouseDragged() {
        if (this.selected != null) {
            return;
        }
        this.x += Environment.p5.mouseX - this.nx;
        this.nx = Environment.p5.mouseX;
        this.y += Environment.p5.mouseY - this.ny;
        this.ny = Environment.p5.mouseY;
    }
}

export { Node };
