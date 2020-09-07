import { ContextMenu, Element } from "./ContextMenu.js";
import { Environment } from "../Environment.js";
import { serialize } from "../GraphSerializer.js";
import { download } from "../Download.js";
import { Node } from "../Node.js";
import { Macro } from "../Macro.js";

class GraphContextMenu extends ContextMenu {
    static Menu;

    constructor() {
        super();

        this.add_entry(
            new Element(
                Environment.p5
                    .createButton("Download Graph")
                    .mousePressed(function () {
                        download(
                            "graph.json",
                            JSON.stringify(serialize(Environment.graph))
                        );

                        GraphContextMenu.Menu.hide();
                    })
            )
        );

        this.add_entry(
            new Element(
                Environment.p5
                    .createButton("Add Macro")
                    .mousePressed(function () {
                        Environment.graph.add_node(
                            new Macro(
                                GraphContextMenu.Menu.x -
                                    Environment.graph.selectedLayer.x,
                                GraphContextMenu.Menu.y -
                                    Environment.graph.selectedLayer.y,
                                "Macro"
                            )
                        );
                        GraphContextMenu.Menu.hide();
                    })
            )
        );

        let sub_menu = new ContextMenu();

        Object.keys(Environment.nodes.nodes).forEach((node) => {
            sub_menu.add_entry(
                new Element(
                    Environment.p5
                        .createButton(node + " Node")
                        .mousePressed(function () {
                            var result = Node.create_node(
                                GraphContextMenu.Menu.x -
                                    Environment.graph.selectedLayer.x,
                                GraphContextMenu.Menu.y -
                                    Environment.graph.selectedLayer.y,
                                node,
                                Environment.nodes.nodes[node]
                            );

                            Environment.graph.add_node(result);

                            GraphContextMenu.Menu.hide();
                        })
                )
            );
        });

        let add_node_button = Environment.p5.createButton("Add Node >");

        add_node_button.mousePressed(function () {
            sub_menu.show(
                add_node_button.x + add_node_button.size().width,
                add_node_button.y
            );
        });

        this.add_entry(
            new Element(add_node_button).set_onHide(function () {
                sub_menu.hide();
            })
        );
    }

    show() {
        console.log(
            "test",
            Environment.graph.canvas.x,
            Environment.graph.canvas.y
        );
        super.show(
            Environment.p5.mouseX, // + Environment.graph.canvas.x,
            Environment.p5.mouseY // + Environment.graph.canvas.y
        );
    }
}

export { GraphContextMenu };
