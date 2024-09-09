import { menu_items } from "../script.js";
import { page, cur_page } from "../router.js";
import { html, mem } from "../solid_monke/solid_monke.js";

/* ===============================
   Menu
   =============================== */
export const Menu = () => {
  let pages = () => menu_items.map((e) => e.text);

  return html`
      .alt-menu
        .alt-menu__button-container 
          each of ${pages} as ${MenuButton}

        .sub-header
          .sub-header__label -- Salankar Pashine & Associates
          .sub-header__empty-black
        .black`

};

/* ===============================
   Label
   =============================== */
const MenuButton = (text) => {
  let click = () => page("/" + text.toLowerCase());
  let is_selected = mem(() => cur_page() == text);

  return html`
    div [onclick=${click} current = ${is_selected}] -- ${text}`;
};
