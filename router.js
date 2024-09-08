import { sig } from "./solid_monke/solid_monke.js";
import page from "./scripts/page.js";
import { q } from "./utils/qs.js";
import { filter_map } from "./pages/project.js";
import { easteregg } from "./utils/colorschemes.js";

/* ===============================
   Router 
   =============================== */

const init = () => {
  page("*", (ctx, next) => {
    ctx.query = q.parse(ctx.querystring);

    if (ctx.query.easteregg) {
      let e = ctx.query.easteregg;
      if (Array.isArray(e)) easteregg(...e);
      if (typeof parseFloat(e) == "number") easteregg(parseFloat(e));
      else easteregg();
    }
    next();
  });

  page("/", () => set_page("Home"));
  page("/work", disablefilters, loadfilters, () => set_page("Work"));
  page("/press", () => set_page("Press"));
  page("/about", () => set_page("About"));
  page("/home", () => set_page("Home"));
  page({ hashbang: true });
};

const disablefilters = (ctx, next) => {
  filter_map.data.forEach((r) => (r.enabled = false));
  next();
}
const loadfilters = (ctx, next) => {
  let f = ctx.query.f;
  if (f) {
    if (typeof f == "string") f = [f];
    f.forEach((filter) => {
      let filter_obj = filter_map.data.find((r) => r.name === filter);
      if (filter_obj) filter_obj.enabled = true;
    });
  }

  next();
};

const set_page = (p) => {
  cur_page.set(p);
  document.title = `[${p}] — Salankar Pashine & Associates`;
};

const cur_page = sig("Home");

export { page, cur_page, init as page_init };
