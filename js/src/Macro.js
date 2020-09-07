import { Node } from "./Node.js";
import { MacroLayer } from "./Layer.js";

class Macro extends Node {
    constructor(x, y, name) {
        super(x, y, name);

        this.layer = new MacroLayer(this);
    }

    add_input(name, type) {
        super.add_input(name, type);
        this.layer.in_node.add_output(name, type);
    }

    add_output(name, type) {
        super.add_output(name, type);
        this.layer.out_node.add_input(name, type);
    }

    serialize() {
        return {
            name: this.name,
            inputs: this.inputs.map((socket) => {
                return { name: socket.name, type: socket.type };
            }),
            outputs: this.outputs.map((socket) => {
                return { name: socket.name, type: socket.type };
            }),
            inner_graph: this.layer.serialize(),
        };
    }
}

class MacroTransput extends Node {
    constructor(x, y, name, macro) {
        super(x, y, name);
        this.macro = macro;
    }
}

export { Macro, MacroTransput };
