import { Environment } from "../Environment.js";

class ContextMenu {
    static max_width = 300;

    static buttonHeight;

    constructor() {
        this.entries = [];

        this.x;
        this.y;

        ContextMenu.buttonHeight = Environment.fontsize + 5;
    }

    show(x, y) {
        this.entries.forEach((entry) => {
            entry.element.position(x, y);
            entry.show();
            y += ContextMenu.buttonHeight;
        });

        this.x = x;
        this.y = y;
    }

    hide() {
        this.entries.forEach((entry) => {
            entry.hide();
        });
    }

    add_entry(button) {
        this.entries.push(button);

        var width = Math.min(
            ContextMenu.max_width,
            this.entries.reduce(
                (min, entry) => Math.max(min, entry.element.width),
                0
            )
        );

        this.entries.forEach((entry) => {
            entry.element.size(width, ContextMenu.buttonHeight);
        });

        button.hide();
    }
}

class Element {
    constructor(element) {
        this.element = element;
        this.onHide = null;
        this.onShow = null;
    }

    show() {
        this.element.show();
        if (this.onShow != null) this.onShow();
    }

    hide() {
        this.element.hide();
        if (this.onHide != null) this.onHide();
    }

    set_onHide(func) {
        this.onHide = func;
        return this;
    }

    set_onShow(func) {
        this.onShow = func;
        return this;
    }
}

export { ContextMenu, Element };
