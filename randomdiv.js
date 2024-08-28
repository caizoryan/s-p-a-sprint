import { x } from "./scripts/hyperaxe.js";
import { mounted } from "./solid_monke/solid_monke.js";
import { fade_in } from "./utils/transitions.js";

export let random_div = () => {
  let height = Math.floor(Math.random() * 5);
  let width = Math.floor(Math.random() * 80);
  let padding = Math.floor(Math.random() * 100) + 100;
  let margin_left = Math.floor(Math.random() * 20);
  let margin_right = Math.floor(Math.random() * 20);

  let style = {
    height: height + "%",
    width: width + "%",
    padding: padding + "px",
    "margin-left": margin_left + "%",
    "margin-right": margin_right + "%",
  };

  mounted(() => fade_in(".random-div"));

  return x("div.random-div")({ style });
};
