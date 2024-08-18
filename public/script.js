import {
  each,
  render,
  sig,
  mem,
  mounted,
  eff,
} from "./solid_monke/solid_monke.js";
import { _ } from "./scripts/hyperaxe.js";
import { page_init, page, cur_page } from "./router.js";
import { data } from "./data/data.js";
import { projects } from "./project.js";
import { fade_in } from "./transitions.js";
import { random_div } from "./randomdiv.js";
import colorschemes from "./colorschemes.js";

page_init();

/* ===============================
   Utilities
   =============================== */

const css = (...args) => less.modifyVars(...args);
const random_item = (arr) => arr[Math.floor(Math.random() * arr.length)];

let colors = sig(colorschemes[0]);
let { div } = _;

eff(() =>
  css({
    "@c1": colors().c1,
    "@c2": colors().c2,
  }),
);

export function change_colors(ctx, next) {
  colors.set(random_item(colorschemes));
  if (next) next();
}

function ColorButton() {
  let click_fn = () => change_colors();
  let attr = { onclick: click_fn };

  let button = _("div.bottom-button");
  return button(attr, "Change Colors");
}

let BackgroundGraphic = () => {
  let container = _("div.background-graphic");
  let random_divs = mem(() => {
    if (colors()) {
      return Array(10).fill(0).map(random_div);
    }
  });
  return container(random_divs);
};

let about = () => {
  mounted(() => fade_in(".about__description"));
  let description = _("div.about__description");
  let description_text =
    "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";
  return _("div.about")(div(), description(description_text));
};

let menu_items = [
  { text: "Home" },
  { text: "Work", render: () => projects(data.projects) },
  { text: "Press" },
  { text: "About", render: about },
];

/* ===============================
   Menu
   =============================== */
const Menu = () => {
  let is_selected = (text) => cur_page() == text;

  let click_fn = (e) => () => {
    page("/" + e.toLowerCase());
    change_colors();
  };
  let attr = (text, s) => ({ current: s, onclick: click_fn(text) });
  let selectable = (text) => div(attr(text, is_selected(text)), text);

  let mapped = () => menu_items.map((e) => e.text).map(selectable);
  let e = mem(mapped);

  let container = _("div.menu__button__container");
  let menu = _("div.menu");
  return menu(container(e), NameLabel, _("div.black"));
};

/* ===============================
   Label
   =============================== */
const NameLabel = () => {
  let label = "Salankar Pashine & Associates";
  let label_container = _("div.sub-header__label")(label);
  let empty_black = _("div.sub-header__empty-black");

  let container = () => _("div.sub-header")(label_container, empty_black);

  return container;
};

let page_render = mem(() => {
  // check if from menu items page has a renderer based on cur page
  let page = menu_items.find((e) => e.text == cur_page());
  return page.render;
});

const Space = (num) => _("div.space")({ style: { height: num + "px" } });

/* ===============================
   Final Page Put Together
   =============================== */
const Mother = () =>
  _("div.mother")(BackgroundGraphic, Menu, page_render, ColorButton);

render(Mother, document.body);
