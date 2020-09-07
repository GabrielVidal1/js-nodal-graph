import { TransputType, SocketColors } from "./Enums.js";
import { Environment } from "./Environment.js";
import { SocketContextMenu } from "./ContextMenus/SocketContextMenu.js";

class Socket {
    static SocketContextMenu;

    constructor(node, name, transput_type, type) {
        this.node = node;
        this.transput_type = transput_type;
        this.type = type;
        this.index = -1;

        this.name = name;
        this.x = 0;
        this.y = 0;

        this.connected_sockets = [];

        Socket.SocketContextMenu = new SocketContextMenu();
    }

    disconnect() {
        this.connected_sockets.forEach((connected_socket) => {
            let socket_in =
                this.transput_type == TransputType.INPUT
                    ? this
                    : connected_socket;
            let socket_out =
                this.transput_type == TransputType.OUTPUT
                    ? this
                    : connected_socket;
            Environment.graph.remove_connection(socket_in, socket_out);
        });
    }

    set_index(index) {
        this.index = index;
        return this;
    }

    draw(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        Environment.p5.fill(SocketColors[this.type]);
        Environment.p5.circle(x, y, radius);
    }

    contains_mouse() {
        return (
            (Environment.p5.mouseX - this.x) ** 2 +
                (Environment.p5.mouseY - this.y) ** 2 <
            this.radius ** 2
        );
    }

    can_connect(sockect1) {
        return (
            this.transput_type != sockect1.transput_type &&
            this.type == sockect1.type
        );
    }
}

export { Socket };
