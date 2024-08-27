import { mounted, mut, mem, each, eff_on } from "../solid_monke/solid_monke.js";
import { x } from "../scripts/hyperaxe.js";
import { fade_in } from "../utils/transitions.js";
import { sig } from "../solid_monke/solid_monke.js";
import { q } from "../utils/qs.js";
import { page } from "../router.js";
import { easteregg } from "../utils/colorschemes.js";
import { change_colors } from "../utils/colorschemes.js";

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

export let filter_map = mut({
  data: [
    { name: "random", filter: f_random, type: "sort", enabled: false },
    {
      name: "alphabetical",
      filter: alphabetical,
      type: "sort",
      enabled: true,
    },

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
  ],
});

let filters = mem(() => {
  return filter_map.data.filter((f) => f.enabled).map((f) => f.filter);
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

  return x("button.filter-button")(
    { onclick: click, active: () => f.enabled },
    f.name,
  );
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
  let toggle = () => {
    show.set(!show());
    localStorage.setItem("show_filters", show());
  };
  let classes = () => "filter-box " + (show() ? "show" : "hide");

  return [
    x("button.filter-box-toggle")({ onclick: toggle }, "filters"),
    x("div")(
      { class: classes },
      x("button.close")({ onclick: toggle }, "x"),
      each(
        () => Object.entries(filter_grouped()),
        ([k, f]) => {
          return x("div")(x("p")(k), each(f, button));
        },
      ),
    ),
  ];
};

let description = () => {
  mounted(() => fade_in(".projects__showing"));
  let description = x("div.projects__showing-text");
  let description_text = mem(() => {
    let type = filter_map.data
      .filter((f) => f.type === "type")
      .find((f) => f.enabled);

    let sub_type = filter_map.data
      .filter((f) => f.type === "sub_type")
      .find((f) => f.enabled);

    type = type ? type.name : null;
    sub_type = sub_type ? sub_type.name : null;

    let words = ["all"];
    if (type || sub_type) words = [];

    if (sub_type) words.push(sub_type);
    if (type) words.push(type);

    if (!type && !sub_type) {
      return "Showing all projects";
    }

    return "Showing " + "(" + count() + ") " + words.join(", ") + " projects";
  });

  return x("div.projects__showing")(x("div"), description(description_text));
};

let count;

export const projects = (projees) => {
  let large = (p) => p.image.large.url;

  let clean_project = (p) => {
    let _p = { ...p };
    _p.images = _p.images.map(large).splice(0, 1);
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
    x("div.projects")(each(filtered_projects, Project)),
  ];
};

const Project = (p) => {
  let { images, title, type, sub_type, id } = p;

  title = title.split("—")[1];

  let box = (id) => "div.project__img";
  let image = (src) => img({ src });
  let element = (src, i) => x(box(id + "-" + i))(image(src));

  let image_elements = images.map(element);
  // let image_pair_box = x("div.project__img-container")(image_elements);
  let image_pair_box = image_elements;
  let metadata = x("div.project__metadata");

  let type_element = x("div.project__type")("[", type.join(" & "), "]");
  let extra = {};

  if (title.includes("Pashine")) {
    let couter = 0;
    let click = () => {
      couter += 1;
      console.log("click");
      if (couter == 20) {
        console.log("easteregg!");
        easteregg();
      }
    };

    extra = { onclick: click };
  }

  let sub_type_element = x("div.project__sub-type")(
    "[",
    sub_type.join(", "),
    "]",
  );

  let title_element = x("div.project__title")(title);

  return x("div.project")(
    image_pair_box,
    metadata(extra, title_element, type_element, sub_type_element),
  );
};
