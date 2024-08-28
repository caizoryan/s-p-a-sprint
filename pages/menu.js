import { menu_items } from "../script.js";
import { change_colors } from "../utils/colorschemes.js";
import { page, cur_page } from "../router.js";
import { mem } from "../solid_monke/solid_monke.js";
import { x } from "../scripts/hyperaxe.js";

let { div } = x;

/* ===============================
   Menu
   =============================== */
export const Menu = () => {
  let is_selected = (text) => cur_page() == text;

  let click_fn = (e) => () => {
    page("/" + e.toLowerCase());
    change_colors();
  };
  let attr = (text, s) => ({ current: s, onclick: click_fn(text) });
  let selectable = (text) => div(attr(text, is_selected(text)), text);

  let mapped = () => menu_items.map((e) => e.text).map(selectable);
  let e = mem(mapped);

  let container = x("div.menu__button-container");
  let menu = x("div.menu");
  return menu(container(e), NameLabel, x("div.black"));
};

/* ===============================
   Label
   =============================== */
const NameLabel = () => {
  let label = "Salankar Pashine & Associates";
  let label_container = x("div.sub-header__label")(label);
  let empty_black = x("div.sub-header__empty-black");

  let container = () => x("div.sub-header")(label_container, empty_black);

  return container;
};
