import { Graph } from "./Graph.js";
import { Environment } from "./Environment.js";

class LayersUI {
    static buttons = [];

    static Update() {
        LayersUI.buttons.forEach((button) => button.remove());
        LayersUI.buttons = [];

        var b = Environment.p5.createButton(
            Environment.graph.selectedLayer.name
        );
        b.position(0, 0);

        b.mousePressed(function () {
            if (Environment.graph.selectedLayer.previous_layer != null)
                Environment.graph.selectedLayer =
                    Environment.graph.selectedLayer.previous_layer;

            LayersUI.Update();
        });

        LayersUI.buttons.push(b);
    }
}

export { LayersUI };
