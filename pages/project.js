import { mounted, mut, mem, each, eff_on } from "../solid_monke/solid_monke.js";
import { x } from "../scripts/hyperaxe.js";
import { h } from "../scripts/h.js"
import { fade_in } from "../utils/transitions.js";
import { sig } from "../solid_monke/solid_monke.js";
import { q } from "../utils/qs.js";
import { page } from "../router.js";
import { easteregg, change_colors } from "../utils/colorschemes.js";

/* ===============================
   Project
   =============================== */

let { img } = x;

let f_random = (a) => {
  let ar = [...a];
  for (let i = ar.length - 1; 0 < i; i--) {
    const j = Math.floor(Math.random() * i);
    [ar[i], ar[j]] = [ar[j], ar[i]];
  }
  return ar;
};

let sqft = (arr) => {
  return [...arr].sort((a, b) => b.sqft - a.sqft);
}
let alphabetical = (arr) => {
  return [...arr].sort((a, b) => a.title.localeCompare(b.title));
};
let architecture = (arr) =>
  [...arr].filter((p) => p.type.includes("architecture"));
let interior = (arr) => [...arr].filter((p) => p.type.includes("interior"));

let hospital = (arr) => [...arr].filter((p) => p.sub_type.includes("hospital"));
let hospitality = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("hospitality"));
let residential = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("residential"));
let commercial = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("commercial"));
let office = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("office"));


export let filter_map = mut({
  data: [
    {
      name: "architecture",
      filter: architecture,
      type: "type",
      enabled: false,
    },
    { name: "interior", filter: interior, type: "type", enabled: false },

    { name: "hospital", filter: hospital, type: "sub_type", enabled: false },

    {
      name: "hospitality",
      filter: hospitality,
      type: "sub_type",
      enabled: false,
    },
    {
      name: "residential",
      filter: residential,
      type: "sub_type",
      enabled: false,
    },
    {
      name: "commercial",
      filter: commercial,
      type: "sub_type",
      enabled: false,
    },
    {
      name: "office",
      filter: office,
      type: "sub_type",
      enabled: false,
    }
  ],
});

let filters = mem(() => {
  return [sqft, ...filter_map.data.filter((f) => f.enabled).map((f) => f.filter)];
});

eff_on(filters, () => {
  fade_in(".project");
  let filter_qs = { f: filters().map((f) => f.name) };

  if (window.location.href.includes("/work")) {
    let r = q.stringify(filter_qs);
    setTimeout(() => {
      page("/work?" + r);
    }, 100);
  }
});

const FilterButton = (f, onenable = () => { }, ondisable = () => { }) => {
  let click = () => {
    change_colors();
    let to_enabled = f.enabled ? false : true;
    to_enabled ? onenable() : ondisable();
    f.enabled = to_enabled;
  };

  return h`
    button.filter-button [ 
      onclick = ${click}
      active = ${f.enabled} ] -- ${f.name}`;
};

const disable_all = (type) => {
  filter_map.data.forEach((r) =>
    r.type === type ? (r.enabled = false) : null,
  );
};

const FilterBox = () => {
  let filter_grouped = mem(() => {
    let acc = {};
    filter_map.data.forEach((f) => {
      acc[f.type] = acc[f.type] || [];
      acc[f.type].push(f);
      return acc;
    });

    return acc;
  });

  let button = (f) => {
    let onenable = () => disable_all(f.type);
    let ondisable = () => disable_all(f.type);

    return FilterButton(f, onenable, ondisable);
  };

  let s = localStorage.getItem("show_filters");
  if (s === null) s = true;

  const parseBool = (s) => {
    if (s === "true") return true;
    if (s === "false") return false;
    return s;
  };

  let show = sig(parseBool(s));
  let toggle = () => { show.set(!show()); localStorage.setItem("show_filters", show()); };
  let classes = () => "filter-box " + (show() ? "show" : "hide");

  let ech = ([category, filter]) => h`
      div
        p -- ${category}
        div -- ${each(filter, button)}`;

  let r = h`
    button.filter-box-toggle [ onclick = ${toggle} ] -- filters

    div [ class=${classes} ]
      button.close [ onclick=${toggle} ] -- x
      div -- ${each(Object.entries(filter_grouped()), ech)}`;

  return r;
};

let description = () => {
  mounted(() => fade_in(".projects__showing"));

  let type = mem(() => filter_map.data.filter((f) => f.type === "type").find((f) => f.enabled));
  let sub_type = mem(() => filter_map.data.filter((f) => f.type === "sub_type").find((f) => f.enabled));

  let description_text = mem(() => {
    let words = ["all"];

    let t = type() ? type().name : null;
    let s = sub_type() ? sub_type().name : null;

    if (t || s) words = [];

    if (s) words.push(s);
    if (t) words.push(t);

    if (!t && !s) return "Showing all projects";


    return "Showing " + "(" + count() + ") " + words.join(", ") + " projects";
  });

  return h`
    .projects__showing
      div 
      .projects__showing-text -- ${description_text}`
};

let count;

export const projects = (projees) => {
  let large = (p) => p.image.large.url;

  let clean_project = (p) => {
    let _p = { ...p };
    _p.title = _p.title.split("—")[1];
    _p.image = _p.images.map(large)[0];
    _p.sub_type = _p.sub_type.map((s) => s.toLowerCase());
    _p.type = _p.type.map((s) => s.toLowerCase());
    return _p;
  };

  mounted(() => fade_in(".projects"));

  let projects = projees.map(clean_project);

  let filtered_projects = mem(() => {
    let arr = projects;

    filters().forEach((f) => (arr = f(arr)));

    return arr;
  });

  count = mem(() => filtered_projects().length);

  return [
    FilterBox,
    description,
    h`.projects -- ${(each(filtered_projects, Project))}`,
  ];
};

const Project = ({ image, title, type, sub_type }) => {
  return h`
  .project

    .project__img 
      img [ src = ${image} ]

    .project__metadata
      .project__title -- ${title}
      .project__type -- [ ${type.join(" & ")} ]
      .project__sub-type -- [ ${sub_type.join(", ")} ]`
};

const is_easter_egg = (title) => {
  extra = {};
  if (title.includes("Pashine")) {
    let couter = 0;
    let click = () => {
      couter += 1;
      if (couter == 20) {
        easteregg();
      }
    };

    extra = { onclick: click };
  }
  return extra;
}
