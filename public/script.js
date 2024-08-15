import { render, sig, mem } from "./solid_monke/solid_monke.js";
import { _ } from "./scripts/hyperaxe.js";
import page from "./scripts/page.js";
let { div } = _;

let cur_page = sig("Home");

// router
page("/", () => cur_page.set("Home"));
page("/work", () => cur_page.set("Work"));
page("/press", () => cur_page.set("Press"));
page("/about", () => cur_page.set("About"));
page("/home", () => cur_page.set("Home"));
// init
page();

const Menu = () => {
  let menu_items = ["Home", "Work", "Press", "About"];

  let is_selected = (text) => cur_page() == text;

  let click_fn = (e) => () => page("/" + e.toLowerCase());
  let attr = (text, s) => ({ current: s, onclick: click_fn(text) });
  let selectable = (text) => div(attr(text, is_selected(text)), text);

  let mapped = () => menu_items.map(selectable);
  let e = mem(mapped);

  let container = _("div.menu");
  return container(e);
};

const NameLabel = () => {
  let label = "Salankar Pashine & Associates";
  let container = _("div.label");

  return container(label);
};

const Page = () => _("div.page")(Menu, NameLabel);

render(Page, document.body);
