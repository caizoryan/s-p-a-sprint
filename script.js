import {
  img,
  div,
  render,
  eff,
  sig,
  mem,
  eff_on,
  p,
} from "./solid_monke/solid_monke.js";
import { data } from "./data.js";

let projects = data.projects;
let presss = data.press[0].images;

let show = sig("hide");
let showing = sig(projects[0].id);
let cur = sig(0);

let full_screen = () => {
  let img_list = mem(() =>
    projects.find((x) => x.id == showing.is()).images.map(large),
  );

  let cur_img = mem(() => img_list()[cur.is()]);
  let _class = mem(() => "project-full " + show.is());
  let next = () => cur.set((cur.is() + 1) % img_list().length);
  let prev = () =>
    cur.is() > 0 ? cur.set(cur.is() - 1) : cur.set(img_list().length - 1);

  eff(() => console.log(img_list()));
  eff(() => console.log(cur.is()));

  return div({ class: _class }, [
    img(cur_img),
    div(
      {
        class: "close",
        onclick: () => {
          show.set("hide");
          cur.set(0);
        },
      },
      "X",
    ),
    div({ class: "prev", onclick: prev }, "<"),
    div({ class: "next", onclick: next }, ">"),
  ]);
};

// basic
let project = (img_set, title, type, id) => {
  let show_this = (i) => {
    show.set("show");
    showing.set(id);
    cur.set(i);
  };

  return div(
    { class: "project" },
    div(
      { class: "project-scroll" },
      width("40%"),
      img_set.map((a, f) => img(thumb(a), { onclick: (e) => show_this(f) })),
    ),
    div(
      { class: "text-container" },
      div({ class: "title" }, title.slice(1)),
      div({ class: "type" }, type),
    ),
  );
};

const project_container = () => {
  return div(
    { class: "project-container" },
    div({ class: "title-box" }, "Selected Projects"),
    projects
      .sort(() => (Math.random() > 0.5 ? -1 : 1))
      .slice(0, 8)
      .map((f) => project(f.images, f.title, f.type.join(" "), f.id)),
  );
};

const press_title = (title) => title.split(".")[0].replace(/_/g, " ");

let press = (img_url, title) => {
  return div(
    { class: "press-box" },
    img(img_url),
    div(
      { class: "text-container" },
      div({ class: "title" }, press_title(title)),
    ),
  );
};

const press_container = () => {
  return div(
    { class: "press-container" },
    div({ class: "title-box" }, "Press"),
    div(
      { class: "press-gallery" },

      presss.map((f) => press(f.image.large.url, f.title)),
    ),
  );
};

const height = (val) => div({ style: { "min-height": val } });
const width = (val) => div({ style: { "min-width": val } });

const landing = () => {
  return div(
    { class: "landing" },
    div({ class: "title" }, "Salankar Pashine & Associates"),
    div(
      { class: "contact" },
      div(
        { class: "address" },
        p("01, RPTS Rd, Laxminagar,"),
        p("Nagpur, Maharashtra, 440022"),
      ),

      div({ class: "phone" }, p("+91 712 222 2222"), p("archspangp@gmail.com")),
    ),
  );
};

const mother = () => {
  return div(
    { class: "mother" },
    landing,
    () => height("40vh"),
    project_container,
    press_container,
    full_screen,
  );
};

// Utils
const large = (i) => i.image.large.url;
const thumb = (i) => i.image.thumb.url;

render(() => mother, document.body);
