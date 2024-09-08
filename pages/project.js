import { html as h, mounted, mut, mem, each, eff_on } from "../solid_monke/solid_monke.js";
import { fade_in } from "../utils/transitions.js";
import { sig } from "../solid_monke/solid_monke.js";
import { q } from "../utils/qs.js";
import { page } from "../router.js";
import { easter_egg_click } from "../utils/colorschemes.js";
import { filter_map_data } from "./project/filters.js";

/* ===============================
   Project
   =============================== */

let sqft = (arr) => [...arr].sort((a, b) => b.sqft - a.sqft);

export let filter_map = mut({ data: filter_map_data });
let enabled = () => filter_map.data.filter((f) => f.enabled);
let filters = mem(() => [sqft, ...enabled().map((f) => f.filter)]);

eff_on(filters, () => { fade_in(".project"); });

let refresh = () => {
  let filter_qs = { f: filters().map((f) => f.name) };

  if (window.location.href.includes("/work")) {
    let r = q.stringify(filter_qs);
    setTimeout(() => page("/work?" + r), 10);
  }
}


const disable_all = (type) => filter_map.data.forEach((r) => r.type === type ? (r.enabled = false) : null)

const filter_grouped = mem(() =>
  filter_map.data.reduce((acc, f) => {
    acc[f.type] = acc[f.type] || [];
    acc[f.type].push(f);
    return acc;
  }, {}));

let projects = sig([]);
let filtered_projects = mem(() => filters().reduce((acc, f) => f(acc), projects()));
let filtered_count = mem(() => filtered_projects().length);

let enabled_type = mem(() => filter_map.data.filter((f) => f.type === "type").find((f) => f.enabled));
let enabled_sub_type = mem(() => filter_map.data.filter((f) => f.type === "sub_type").find((f) => f.enabled));

let description_text = mem(() => {
  let words = [];

  let t = enabled_type()?.name
  let s = enabled_sub_type()?.name

  if (!t && !s) return "Showing all projects";
  if (s) words.push(s);
  if (t) words.push(t);

  return "Showing " + "(" + filtered_count() + ") " + words.join(", ") + " projects";
});


const FilterBox = () => {
  const s = localStorage.getItem("show_filters") || "true";
  const parseBool = (s) => s === "true";
  const show = sig(parseBool(s));

  const toggle = () => { show.set(!show()); localStorage.setItem("show_filters", show()); };
  const classes = () => "filter-box " + (show() ? "show" : "hide");
  const filter_categorised = Object.entries(filter_grouped());

  const FilterButton = (f) => {
    const toggle = () => { disable_all(f.type); f.enabled = !f.enabled; refresh(); };

    return h`
    button.filter-button [
      onclick = ${toggle}
      active = ${() => f.enabled} ] -- ${f.name}`;
  };

  const Category = ([category, filter]) => h`
      div
        p -- ${category}
        each of ${filter} as ${FilterButton}`;

  return h`
    button.filter-box-toggle [ onclick = ${toggle} ] -- filters

    div [ class=${classes} ]
      button.close [ onclick=${toggle} ] -- x

      each 
        of ${filter_categorised} 
        as ${Category}`;
};

const Project = ({ image, title, type, sub_type }) => {
  let easteregg = easter_egg_click(title);
  return h`
  .project [onclick=${easteregg}]

    .project__img 
      img [ src = ${image} ]

    .project__metadata
      .project__title -- ${title}
      .project__type -- [ ${type.join(" & ")} ]
      .project__sub-type -- [ ${sub_type.join(", ")} ]`
};


export const Projects = (p) => {
  mounted(() => {
    fade_in(".projects")
  });

  projects.set(p.map(clean_project));

  return h`
    .filters -- ${FilterBox}

    .projects__showing
      .empty-div 
      .projects__showing-text -- ${description_text}

    .projects
      each of ${filtered_projects} as ${Project}`;
};


const large = (p) => p.image.large.url;

const clean_project = (p) => {
  let _p = { ...p };
  _p.title = _p.title.split("—")[1];
  _p.image = _p.images.map(large)[0];
  _p.sub_type = _p.sub_type.map((s) => s.toLowerCase());
  _p.type = _p.type.map((s) => s.toLowerCase());
  return _p;
};
