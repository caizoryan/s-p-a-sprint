import {
  render,
  mem,
} from "./solid_monke/solid_monke.js";
import { x } from "./scripts/hyperaxe.js";
import { page_init, cur_page } from "./router.js";
import { data } from "./data/data.js";
import { projects } from "./project.js";
import { random_div } from "./randomdiv.js";
import { About } from "./about.js";
import { Press } from "./press.js";
import { Menu } from "./menu.js";
import { colors } from "./colorschemes.js";

page_init();

let BackgroundGraphic = () => {
  let container = x("div.background-graphic");
  let random_divs = mem(() => {
    if (colors()) {
      let c = 10;
      return Array(c).fill(0).map(random_div);
    }
  });
  return container(random_divs);
};


export let menu_items = [
  { text: "Home" },
  { text: "Work", render: () => projects(data.projects) },
  { text: "Press", render: () => Press(data.press[0].images) },
  { text: "About", render: About },
];


let CurrentPage = mem(() => {
  // check if from menu items page has a renderer based on cur page
  let page = menu_items.find((e) => e.text == cur_page());
  return page.render;
});

/* ===============================
   Final Page Put Together
   =============================== */
const Mother = () => x("div.mother")(BackgroundGraphic, Menu, CurrentPage);

render(Mother, document.body);
