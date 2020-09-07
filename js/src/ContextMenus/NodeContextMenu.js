import { ContextMenu, Element } from "./ContextMenu.js";
import { Environment } from "../Environment.js";
import { MacroUI } from "../MacroUI.js";
import { Macro, MacroTransput } from "../Macro.js";
import { download } from "../Download.js";

class NodeContextMenu extends ContextMenu {
    static Menu;

    constructor() {
        super();
    }

    show(node) {
        NodeContextMenu.Menu.entries.forEach((element) => {
            element.element.remove();
        });
        NodeContextMenu.Menu.entries = [];

        if (!(node instanceof MacroTransput)) {
            this.add_entry(
                new Element(
                    Environment.p5
                        .createButton("Delete Node")
                        .mousePressed(function () {
                            Environment.graph.remove_node(node);
                            NodeContextMenu.Menu.hide();
                        })
                )
            );

            this.add_entry(
                new Element(
                    Environment.p5
                        .createButton("Open")
                        .mousePressed(function () {
                            Environment.graph.open_layer(node.layer);
                            NodeContextMenu.Menu.hide();
                        })
                )
            );
        }

        if (node instanceof Macro || node instanceof MacroTransput) {
            var macro = node instanceof Macro ? node : node.macro;

            this.add_entry(
                new Element(
                    Environment.p5
                        .createButton("Options")
                        .mousePressed(function () {
                            MacroUI.ui.show(macro);
                            NodeContextMenu.Menu.hide();
                        })
                )
            );

            this.add_entry(
                new Element(
                    Environment.p5
                        .createButton("Download Macro")
                        .mousePressed(function () {
                            download(
                                "macro.json",
                                JSON.stringify(macro.serialize())
                            );
                            NodeContextMenu.Menu.hide();
                        })
                )
            );
        }

        super.show(
            Environment.p5.mouseX + Environment.graph.canvas.x,
            Environment.p5.mouseY + Environment.graph.canvas.y
        );
    }
}

export { NodeContextMenu };
