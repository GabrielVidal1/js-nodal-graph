import { Environment } from "./Environment.js";

new p5(function (p5) {
    Environment.singleton = new Environment(p5);
});
