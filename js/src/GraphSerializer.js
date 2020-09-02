import { Graph } from "./Graph.js";
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
    };
}

export { serialize };
