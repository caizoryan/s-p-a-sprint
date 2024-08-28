import { x } from "../scripts/hyperaxe.js";
import { mounted } from "../solid_monke/solid_monke.js";
import { fade_in } from "../utils/transitions.js";

const PressBox = (press) => {
  let { title, image } = press;
  let { img } = x;
  title = title.replace(/_/g, " ").split(".")[0];
  const press_title = (t) => x("div.press__title")(t);
  const press_image = (i) => img({ src: i });
  const press_image_box = (i) => x("div.press__image")(press_image(i));
  let large = (p) => p.large.url;
  let container = x("div.press__box");

  mounted(() => fade_in(".press__box"));

  return container(
    press_image_box(large(image)),
    // press_title(title)
  );
};

export const Press = (p) => {
  console.log("press")
  console.log(p)
  let container = x("div.press-container");
  let press_boxes = p.map(PressBox);

  return x("div.press")(container(press_boxes));
};
