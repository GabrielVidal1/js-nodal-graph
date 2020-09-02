import { ContextMenu, Element } from "./ContextMenu.js";
import { Environment } from "../Environment.js";

class NodeContextMenu extends ContextMenu {
    static Menu;

    constructor() {
        super();

        this.node;

        this.add_entry(
            new Element(
                Environment.p5
                    .createButton("Delete Node")
                    .mousePressed(function () {
                        Environment.graph.remove_node(
                            NodeContextMenu.Menu.node
                        );
                        NodeContextMenu.Menu.hide();
                    })
            )
        );
    }

    show(node) {
        this.node = node;
        super.show(
            Environment.p5.mouseX + Environment.graph.canvas.x,
            Environment.p5.mouseY + Environment.graph.canvas.y
        );
    }
}

export { NodeContextMenu };
