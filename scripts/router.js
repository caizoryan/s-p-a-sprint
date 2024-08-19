import { sig } from "./solid_monke/solid_monke.js";
import page from "./scripts/page.js";

/* ===============================
   Router 
   =============================== */

const init = () => {
  page("/", () => cur_page.set("Home"));
  page("/#work", () => cur_page.set("Work"));
  page("/#press", () => cur_page.set("Press"));
  page("/#about", () => cur_page.set("About"));
  page("/#home", () => cur_page.set("Home"));
  page();
};

const cur_page = sig("Home");

export { page, cur_page, init as page_init };
