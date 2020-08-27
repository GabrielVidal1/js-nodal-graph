import { TransputType } from "./enums.js";

class Socket {
    constructor(node, name, transput_type, type) {
        this.node = node;
        this.transput_type = transput_type;
        this.type = type;

        this.name = name;
        this.x = 0;
        this.y = 0;

        this.connected_sockets = [];
    }

    draw(p5, x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        p5.fill(this.type);
        p5.circle(x, y, radius);
    }

    contains_mouse(p5) {
        return (
            (p5.mouseX - this.x) ** 2 + (p5.mouseY - this.y) ** 2 <
            this.radius ** 2
        );
    }

    static connect(sockect1, sockect2) {
        if (
            sockect1.transput_type == sockect2.transput_type ||
            sockect1.type != sockect2.type
        )
            return;

        let socket_out =
            sockect1.transput_type == TransputType.OUTPUT ? sockect1 : sockect2;
        let socket_in =
            sockect1.transput_type == TransputType.INPUT ? sockect1 : sockect2;

        while (socket_in.connected_sockets.length > 0) {
            socket_in.node.graph.remove_connection(
                socket_in,
                socket_in.connected_sockets[0]
            );
        }

        socket_in.node.graph.add_connection(socket_out, socket_in);
    }
}

export { Socket };
