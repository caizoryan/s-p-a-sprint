import { $$ } from "../solid_monke/solid_monke.js";
const fade_in = (selector, r = 100) => {
  $$(selector).forEach((e) => {
    e.style.opacity = 0;
    e.style.transform = "translateY(" + r + "px)";
    setTimeout(
      () => ((e.style.opacity = 1), (e.style.transform = "translateY(0px)")),
      10,
    );
  });
};

export { fade_in };
