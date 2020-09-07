import { ContextMenu, Element } from "./ContextMenu.js";
import { TransputType } from "../Enums.js";
import { Environment } from "../Environment.js";

class SocketContextMenu extends ContextMenu {
    static Menu;
    constructor() {
        super();
    }

    show(socket) {
        this.entries.forEach((element) => {
            element.element.remove();
        });
        this.entries = [];

        socket.connected_sockets.forEach((connected_socket) => {
            this.add_entry(
                new Element(
                    Environment.p5
                        .createButton(
                            "Remove connection with " +
                                connected_socket.node.name
                        )
                        .mousePressed(function () {
                            let socket_in =
                                socket.transput_type == TransputType.INPUT
                                    ? socket
                                    : connected_socket;
                            let socket_out =
                                socket.transput_type == TransputType.OUTPUT
                                    ? socket
                                    : connected_socket;
                            Environment.graph.remove_connection(
                                socket_in,
                                socket_out
                            );
                            SocketContextMenu.Menu.hide();
                        })
                )
            );
        });
        super.show(
            Environment.p5.mouseX + Environment.graph.canvas.x,
            Environment.p5.mouseY + Environment.graph.canvas.y
        );
    }
}

export { SocketContextMenu };
