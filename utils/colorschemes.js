import { sig, eff } from "../solid_monke/solid_monke.js";

const easteregg = (t = 3000, rate = 0.05, cutoff = 800) => {
  colorschemes = colorschemes.concat(extensions);
  new_timeout(t, rate, cutoff);
};

const css = (...args) => less.modifyVars(...args);

const easter_egg_click = (title) => {
  let extra = () => { }
  if (title.includes("Pashine")) {
    let couter = 0;
    let click = () => {
      couter += 1;
      if (couter == 20) { easteregg(); }
    };
    extra = click;
  }
  return extra;
}

const new_timeout = (time, rate, cutoff) => {
  setTimeout(() => {
    change_colors();
    if (time > 100) new_timeout(time - time * 0.05);
    else
      setInterval(() => {
        change_colors();
      }, 800);
  }, time);
};

let colorschemes = [
  {
    c1: "#111",
    c2: "#eee",
  },
];

export let colors = sig(colorschemes[0]);

eff(() =>
  css({
    "@c1": colors().c1,
    "@c2": colors().c2,
  }),
);

export function change_colors() {
  const random_item = (arr) => arr[Math.floor(Math.random() * arr.length)];
  colors.set(random_item(colorschemes));
}

export { colorschemes, easteregg, easter_egg_click };

let extensions = [
  {
    c2: "#0c252c",
    c1: "#f2f2f2",
  },
  {
    c2: "#111",
    c1: "#eee",
  },
  {
    c1: "#22437e",
    c2: "#d8c9c0",
  },
  {
    c1: "#311c3d",
    c2: "#f2e3f8",
  },
  {
    c1: "#9ec7a9",
    c2: "#ee6a92",
  },
  {
    c1: "#646569",
    c2: "#95aa89",
  },
  {
    c1: "#d1e58c",
    c2: "#df7946",
  },
  {
    c1: "#82b5b8",
    c2: "#d95441",
  },
  {
    c1: "#0c252c",
    c2: "#f2f2f2",
  },
  {
    c1: "#42532f",
    c2: "#d8c9c0",
  },
  {
    c1: "#e4797c",
    c2: "#d8c9c0",
  },
  {
    c1: "#d8c9c0",
    c2: "#f6f859",
  },
  {
    c1: "#22437e",
    c2: "#d8c9c0",
  },
];
