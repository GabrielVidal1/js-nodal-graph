import { Graph } from "./Graph.js";
import { Macro } from "./Macro.js";
/**
 * Serialize a graph to a more readable format.
 * @param {Graph} graph The graph to serialize
 */
function serialize(graph) {
    return {
        nodes: graph.nodes.map((node) => {
            return { name: node.name, position: { x: node.x, y: node.y } };
        }),
        connections: Array.from(graph.connections, ([key, value]) => {
            return (
                key.node.id +
                " " +
                key.index +
                " " +
                value.node.id +
                " " +
                value.index
            );
        }),
        macros: (function () {
            var macros = {};
            var macros_node = graph.nodes.filter(
                (node) =>
                    function () {
                        return node instanceof Macro;
                    }
            );
            macros_node.forEach((macro) => {
                macros[macro.name] = {
                    inputs: macro.inputs.map((input) => {
                        return {
                            name: input.name,
                            type: input.type,
                        };
                    }),
                    outputs: macro.outputs.map((output) => {
                        return {
                            name: output.name,
                            type: output.type,
                        };
                    }),
                };
            });
            return macros;
        })(),
    };
}

export { serialize };
