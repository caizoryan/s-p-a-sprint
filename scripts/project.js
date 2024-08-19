import { mounted } from "./solid_monke/solid_monke.js";
import { _ as x } from "./scripts/hyperaxe.js";
import { fade_in } from "./transitions.js";

/* ===============================
   Project
   =============================== */

let { img } = x;

export const projects = (projees) => {
  let large = (p) => p.image.large.url;

  let clean_project = (p) => {
    let _p = { ...p };
    _p.images = _p.images.map(large).splice(0, 2);
    return _p;
  };

  mounted(() => fade_in(".project"));

  let projects = projees.map(clean_project).sort(() => Math.random() - 0.5);
  let daddy = projects.map(Project);

  return daddy;
};

const Project = (p) => {
  let { images, title, type, sub_type, id } = p;

  let box = (id) => "div.project__img.sierra-" + id;
  let image = (src) => img({ src });
  let element = (src, i) => x(box(id + "-" + i))(image(src));

  let image_pair = images.map(element);
  let image_pair_box = x("div.project__pair")(image_pair);
  let title_element = x("div.project__title")(title);

  return x("div.project")(image_pair_box, title_element);
};
