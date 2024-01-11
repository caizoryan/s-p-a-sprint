import {
  img,
  div,
  render,
  each,
  sig,
  mem,
  eff_on,
} from "./solid_monke/solid_monke.js";
import { data } from "./data.js";

let projects = data.projects;
let press = data.press;

let show = sig("hide");
let showing = sig(projects[0].id);

// basic
let project = (img_set, title, type, id) => {
  let show_this = () => {
    show.set("show");
    showing.set(id);
  };

  return div({ class: "project", onclick: show_this }, [
    div(
      { class: "text-container" },
      div({ class: "title" }, title.slice(1)),
      div({ class: "type" }, type),
    ),
    img_set.map((a) => img(thumb(a))),
  ]);
};

let full_screen = () => {
  let img_list = mem(() =>
    projects.find((x) => x.id == showing.is()).images.map(large),
  );

  let cur = sig(0);
  let cur_img = mem(() => img_list()[cur.is()]);
  let _class = mem(() => "project-full " + show.is());
  let next = () => cur.set((cur.is() + 1) % img_list().length);
  let prev = () =>
    cur.is() > 0 ? cur.set(cur.is() - 1) : cur.set(img_list().length - 1);

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

const project_contianer = () => {
  return div(
    { class: "project-container" },
    projects
      .sort(() => (Math.random() > 0.5 ? -1 : 1))
      .slice(0, 8)
      .map((f) => project(f.images, f.title, f.type.join(" "), f.id)),
  );
};

const mother = () => {
  return div({ class: "mother" }, project_contianer, full_screen);
};

// Utils
const large = (i) => i.image.large.url;
const thumb = (i) => i.image.thumb.url;

render(() => mother, document.body);
