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
import { About } from "./about.js";
import colorschemes from "./colorschemes.js";

page_init();

/* ===============================
   Utilities
   =============================== */

const css = (...args) => less.modifyVars(...args);
const random_item = (arr) => arr[Math.floor(Math.random() * arr.length)];

let colors = sig(colorschemes[0]);
let { div } = _;

eff(() => {
  console.log(cur_page());
});

eff(() =>
  css({
    "@c1": colors().c1,
    "@c2": colors().c2,
  }),
);

export function change_colors() {
  let recursive_new = () => {
    let new_colors = random_item(colorschemes);
    while (new_colors.c1 == colors().c1 && new_colors.c2 == colors().c2) {
      new_colors = random_item(colorschemes);
    }
    return new_colors;
  };
  colors.set(recursive_new());
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

const PressBox = (press) => {
  let { title, image } = press;
  let { img } = _;
  title = title.replace(/_/g, " ").split(".")[0];
  const press_title = (t) => _("div.press__title")(t);
  const press_image = (i) => img({ src: i });
  const press_image_box = (i) => _("div.press__image")(press_image(i));
  let large = (p) => p.large.url;
  let container = _("div.press__box");

  console.log(press);

  return container(
    press_image_box(large(image)),
    // press_title(title)
  );
};

const Press = (p) => {
  const empty = () => _("div.press__box--empty");
  let container = _("div.press-container");
  let press_boxes = p.map(PressBox);

  return _("div.press")(container(press_boxes));
};

let menu_items = [
  { text: "Home" },
  { text: "Work", render: () => projects(data.projects) },
  { text: "Press", render: () => Press(data.press[0].images) },
  { text: "About", render: About },
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
