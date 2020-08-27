class Graph {
    constructor(fontsize) {
        this.x = 0;
        this.y = 0;

        this.nodes = [];
        this.connections = [];

        this.nx = 0;
        this.ny = 0;

        this.selected = null;

        this.fontsize = fontsize;
    }

    add_node(node) {
        node.graph = this;
        this.nodes.push(node);
    }

    add_connection(socket_out, socket_in) {
        this.connections.push([socket_out, socket_in]);
    }

    remove_connection(socket1, socket2) {
        let index = this.connections.find([socket1, socket2]);
        if (index > -1) this.connections.splice(index, 1);

        index = socket1.connected_sockets.find(socket2);
        if (index > -1) socket1.connected_sockets.splice(index, 1);

        index = socket2.connected_sockets.find(socket1);
        if (index > -1) socket2.connected_sockets.splice(index, 1);
    }

    draw(p5) {
        p5.background(0);

        var gridSize = 200;

        p5.stroke(200);

        for (var i = this.x % gridSize; i < p5.width; i += gridSize)
            p5.line(i, 0, i, p5.height);

        for (var i = this.y % gridSize; i < p5.height; i += gridSize)
            p5.line(0, i, p5.width, i);

        p5.push();
        p5.stroke(255);
        p5.fill(0, 0, 0, 0);
        p5.strokeWeight(4);
        this.connections.forEach((item, i) => {
            p5.bezier(
                item[0].x,
                item[0].y,
                item[0].x + 100,
                item[0].y,
                item[1].x - 100,
                item[1].y,
                item[1].x,
                item[1].y
            );
        });
        p5.pop();

        this.nodes.forEach((item, i) => {
            item.draw(p5);
        });
    }

    mousePressed(p5) {
        console.log("graph - mousePressed");

        var res = this.nodes.filter((node, i) => node.contains_mouse(p5));

        if (res.length > 0) {
            this.selected = res[0];

            this.selected.mousePressed(p5);

            return;
        }

        this.nx = p5.mouseX;
        this.ny = p5.mouseY;
    }

    mouseReleased(p5) {
        console.log(this.selected);
        if (this.selected != null) {
            this.selected.mouseReleased(p5);
        }
        this.selected = null;
    }

    mouseDragged(p5) {
        if (this.selected != null) {
            this.selected.mouseDragged(p5);

            return;
        }

        this.x += p5.mouseX - this.nx;
        this.nx = p5.mouseX;
        this.y += p5.mouseY - this.ny;
        this.ny = p5.mouseY;
    }
}

export { Graph };
