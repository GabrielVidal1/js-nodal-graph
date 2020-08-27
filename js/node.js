import { Socket } from "./socket.js";
import { TransputType, ValueType } from "./enums.js";

class Node {
    constructor(x, y, name) {
        this.graph = null;
        this.x = x;
        this.y = y;

        this.inputs = [];
        this.outputs = [];

        this.offset = 10;

        this.width = 10;
        this.height = 10;

        this.name = name;

        this.nx = 0;
        this.ny = 0;

        this.selected = null;

        this.first_draw = true;
    }

    add_input(name, type) {
        this.inputs.push(new Socket(this, name, TransputType.INPUT, type));
        return this;
    }

    add_output(name, type) {
        this.outputs.push(new Socket(this, name, TransputType.OUTPUT, type));
        return this;
    }

    contains_mouse(p5) {
        return (
            p5.mouseX > this.x + this.graph.x &&
            p5.mouseX < this.x + this.graph.x + this.width &&
            p5.mouseY > this.y + this.graph.y &&
            p5.mouseY < this.y + this.graph.y + this.height
        );
    }

    draw(p5) {
        if (this.first_draw) {
            this.width = 10 + 2 * this.offset + p5.textWidth(this.name);
            this.height =
                2 * this.offset +
                (this.graph.fontsize + 10) *
                    (1 + this.inputs.length + this.outputs.length);
            this.first_draw = false;
        }
        /*
        p5.fill(10);
        p5.rect(
            this.graph.x + this.x,
            this.graph.y + this.y,
            this.width,
            this.height
        );
        */

        var witdh = this.width - 2 * this.offset;

        p5.fill(200, 0, 0);
        p5.rect(
            this.graph.x + this.x + this.offset,
            this.graph.y + this.y + this.offset,
            witdh,
            this.height - 2 * this.offset
        );

        p5.fill(120, 0, 0);
        p5.rect(
            this.graph.x + this.x + this.offset,
            this.graph.y + this.y + this.offset,
            witdh,
            this.graph.fontsize + 10
        );

        p5.textAlign(p5.CENTER, p5.CENTER);

        p5.fill(255);
        p5.text(
            this.name,
            this.graph.x + this.x + this.width / 2,
            this.graph.y + this.y + this.offset + 5 + this.graph.fontsize / 2
        );

        var blockHeight = this.graph.fontsize + 10;

        this.inputs.forEach((socket, i) => {
            var x = this.graph.x + this.x + this.offset;
            var y =
                this.graph.y +
                this.y +
                this.offset +
                (i + 1) * (this.graph.fontsize + 10);

            p5.fill(80, 0, 0);
            p5.rect(x, y, witdh, blockHeight);

            p5.textAlign(p5.LEFT, p5.CENTER);
            p5.fill(255);
            p5.text(socket.name, x + 15, y + blockHeight / 2);
            socket.draw(p5, x, y + blockHeight / 2, 15);
        });

        this.outputs.forEach((socket, i) => {
            var x = this.graph.x + this.x + this.offset;
            var y =
                this.graph.y +
                this.y +
                this.offset +
                (i + 1 + this.inputs.length) * (this.graph.fontsize + 10);

            p5.fill(80, 0, 0);
            p5.rect(x, y, witdh, blockHeight);

            p5.textAlign(p5.RIGHT, p5.CENTER);
            p5.fill(255);
            p5.text(
                socket.name,
                x + this.width - 2 * this.offset - 15,
                y + blockHeight / 2
            );
            socket.draw(
                p5,
                x + this.width - 2 * this.offset,
                y + blockHeight / 2,
                15
            );
        });

        if (this.selected != null) {
            p5.push();
            p5.stroke(255);
            p5.fill(0, 0, 0, 0);
            p5.strokeWeight(4);
            p5.bezier(
                this.selected.x,
                this.selected.y,
                this.selected.x +
                    (this.selected.transput_type == TransputType.OUTPUT
                        ? 100
                        : -100),
                this.selected.y,
                p5.mouseX,
                p5.mouseY,
                p5.mouseX,
                p5.mouseY
            );
            p5.pop();
            return;
        }
    }

    mousePressed(p5) {
        var sockets = this.inputs
            .concat(this.outputs)
            .filter((socket) => socket.contains_mouse(p5));

        if (sockets.length > 0) {
            this.selected = sockets[0];
            return;
        }

        if (p5.mouseButton == p5.RIGHT) {
            console.log("right");
        }

        this.nx = p5.mouseX;
        this.ny = p5.mouseY;
    }

    mouseReleased(p5) {
        console.log(this.selected);
        if (this.selected != null) {
            var sockets = this.graph.nodes
                .filter((node) => node.contains_mouse(p5))
                .flatMap((node) => node.inputs.concat(node.outputs))
                .filter((socket) => socket.contains_mouse(p5));
            console.log("grosse chouquette");
            if (sockets.length > 0) {
                if (Socket.connect(this.selected, sockets[0]))
                    this.graph.add_connection([this.selected, sockets[0]]);
            } else {
                console.log(this.selected.transput_type);
                if (this.selected.transput_type == TransputType.INPUT) {
                    console.log("123");
                    while (this.selected.connected_sockets.length > 0)
                        this.selected.node.graph.remove_connection(
                            this.selected,
                            this.selected.connected_sockets[0]
                        );
                }
            }
        }
        this.selected = null;
    }

    mouseDragged(p5) {
        if (this.selected != null) {
            return;
        }
        this.x += p5.mouseX - this.nx;
        this.nx = p5.mouseX;
        this.y += p5.mouseY - this.ny;
        this.ny = p5.mouseY;
    }
}

export { Node };
