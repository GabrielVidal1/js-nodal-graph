import { Macro } from "./Macro.js";
import { Environment } from "./Environment.js";
import { SocketColors, TransputType } from "./Enums.js";

class MacroUI {
    static ui;

    static margin = 30;

    constructor() {
        this.macro;
        this.selected_socket;
        this.selected_transput_field;

        this.div = Environment.p5.createDiv("");
        this.div.class("panel");
        this.div
            .position(MacroUI.margin, MacroUI.margin)
            .size(
                Environment.width - 2 * MacroUI.margin,
                Environment.height - 2 * MacroUI.margin
            );
        this.div.hide();

        let upField = Environment.p5.createDiv("");
        upField.class("upfield");
        upField.parent(this.div);

        this.nameField = Environment.p5.createInput("qze");
        this.nameField.parent(upField);
        this.nameField.class("nameField");
        this.nameField.input(function () {
            MacroUI.ui.macro.name = this.value();
        });

        let cross = Environment.p5
            .createButton("X")
            .mousePressed(function () {
                MacroUI.ui.hide();
            })
            .parent(upField);
        cross.class("cross");

        let parameters = Environment.p5.createDiv();
        parameters.parent(this.div);
        parameters.class("parameters");

        let parameterList = Environment.p5.createDiv("qqq");
        parameterList.parent(parameters);
        parameterList.class("parameterList");

        this.input_list = Environment.p5.createDiv("inputs");
        this.input_list.parent(parameterList);
        this.input_list.class("transput_list");
        this.inputs = [];

        let add_input_button = Environment.p5.createButton("Add Input");
        add_input_button.parent(this.input_list);
        add_input_button.class("add_transput_button");
        add_input_button.mousePressed(function () {
            console.log("add input");
            MacroUI.ui.macro.add_input("input", "NONE");

            var socket =
                MacroUI.ui.macro.inputs[MacroUI.ui.macro.inputs.length - 1];

            let e = Environment.p5.createButton(socket.name);
            e.mousePressed(function () {
                MacroUI.ui.select_transput(socket, e);
            });
            e.parent(MacroUI.ui.input_list);
            e.class("transput");
            e.style("background-color", SocketColors[socket.type]);
            MacroUI.ui.inputs.push(e);
        });

        this.output_list = Environment.p5.createDiv("outputs");
        this.output_list.parent(parameterList);
        this.output_list.class("transput_list");
        this.outputs = [];

        let add_output_button = Environment.p5.createButton("Add Output");
        add_output_button.parent(this.output_list);
        add_output_button.class("add_transput_button");
        add_output_button.mousePressed(function () {
            MacroUI.ui.macro.add_output("output", "NONE");

            var socket =
                MacroUI.ui.macro.outputs[MacroUI.ui.macro.outputs.length - 1];

            let e = Environment.p5.createButton(socket.name);
            e.mousePressed(function () {
                MacroUI.ui.select_transput(socket, e);
            });
            e.parent(MacroUI.ui.output_list);
            e.class("transput");
            e.style("background-color", SocketColors[socket.type]);
            MacroUI.ui.outputs.push(e);
        });

        this.parameterPanel = Environment.p5.createDiv();
        this.parameterPanel.hide();
        this.parameterPanel.parent(parameters);
        this.parameterPanel.class("parameterPanel");

        this.parameterNameField = Environment.p5.createInput();
        this.parameterNameField.parent(this.parameterPanel);
        this.parameterNameField.class("paramameterNameField");
        this.parameterNameField.input(function () {
            if (MacroUI.ui.selected_socket != null) {
                MacroUI.ui.selected_socket.name = this.value();
                MacroUI.ui.selected_transput_field.html(this.value());

                var inner_socket =
                    MacroUI.ui.selected_socket.transput_type ==
                    TransputType.INPUT
                        ? MacroUI.ui.macro.layer.in_node.outputs[
                              MacroUI.ui.selected_socket.index
                          ]
                        : MacroUI.ui.macro.layer.out_node.inputs[
                              MacroUI.ui.selected_socket.index
                          ];
                inner_socket.name = this.value();
            }
        });

        let removeParameterButton = Environment.p5.createButton(
            "Remove Parameter"
        );
        removeParameterButton.parent(this.parameterPanel);
        removeParameterButton.mousePressed(function () {
            if (MacroUI.ui.selected_socket != null) {
                MacroUI.ui.selected_socket.disconnect();

                (MacroUI.ui.selected_socket.transput_type == TransputType.INPUT
                    ? MacroUI.ui.macro.inputs
                    : MacroUI.ui.macro.outputs
                ).splice(MacroUI.ui.selected_socket.index, 1);
                (MacroUI.ui.selected_socket.transput_type == TransputType.INPUT
                    ? MacroUI.ui.inputs
                    : MacroUI.ui.outputs
                ).splice(MacroUI.ui.selected_socket.index, 1);

                (MacroUI.ui.selected_socket.transput_type == TransputType.INPUT
                    ? MacroUI.ui.macro.layer.in_node.outputs
                    : MacroUI.ui.macro.layer.out_node.inputs)[
                    MacroUI.ui.selected_socket.index
                ].disconnect();

                (MacroUI.ui.selected_socket.transput_type == TransputType.INPUT
                    ? MacroUI.ui.macro.layer.in_node.outputs
                    : MacroUI.ui.macro.layer.out_node.inputs
                ).splice(MacroUI.ui.selected_socket.index, 1);

                MacroUI.ui.selected_socket.type = null;
                MacroUI.ui.selected_transput_field.remove();
                MacroUI.ui.selected_transput_field = null;
                MacroUI.ui.parameterPanel.hide();
            }
        });

        this.parameterType = Environment.p5.createSelect();
        this.parameterType.parent(this.parameterPanel);
        this.parameterType.class("parameterType");

        Object.keys(SocketColors).forEach((option) => {
            this.parameterType.option(option);
        });
        this.parameterType.changed(function () {
            if (MacroUI.ui.selected_socket != null) {
                MacroUI.ui.selected_socket.disconnect();
                MacroUI.ui.selected_socket.type = this.value();
                MacroUI.ui.selected_transput_field.style(
                    "background-color",
                    SocketColors[this.value()]
                );

                var inner_socket =
                    MacroUI.ui.selected_socket.transput_type ==
                    TransputType.INPUT
                        ? MacroUI.ui.macro.layer.in_node.outputs[
                              MacroUI.ui.selected_socket.index
                          ]
                        : MacroUI.ui.macro.layer.out_node.inputs[
                              MacroUI.ui.selected_socket.index
                          ];
                inner_socket.type = this.value();
            }
        });
    }

    show(macro) {
        if (!(macro instanceof Macro)) {
            console.log("Not a Macro");
            return;
        }

        console.log(macro);

        this.nameField.value(macro.name);

        this.outputs.forEach((output) => output.remove());
        this.inputs.forEach((input) => input.remove());

        this.macro = macro;

        macro.inputs.forEach((input) => {
            let e = Environment.p5.createButton(input.name);
            e.mousePressed(function () {
                MacroUI.ui.select_transput(input, e);
            });
            e.parent(MacroUI.ui.input_list);
            e.class("transput");
            e.style("background-color", SocketColors[input.type]);

            MacroUI.ui.inputs.push(e);
        });

        macro.outputs.forEach((output) => {
            let e = Environment.p5.createButton(output.name);
            e.mousePressed(function () {
                MacroUI.ui.select_transput(output, e);
            });
            e.parent(MacroUI.ui.output_list);
            e.class("transput");
            e.style("background-color", SocketColors[output.type]);

            MacroUI.ui.outputs.push(e);
        });

        this.div.show();
    }

    select_transput(socket, transput) {
        console.log(transput);
        this.selected_transput_field = transput;
        this.selected_socket = socket;
        this.parameterNameField.value(socket.name);
        this.parameterType.value(socket.type);
        this.parameterPanel.show();
    }

    hide() {
        this.div.hide();

        this.macro = null;
        this.selected_socket = null;
        this.selected_transput_field = null;
    }
}

export { MacroUI };
