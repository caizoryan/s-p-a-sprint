import { $$ } from "./solid_monke/solid_monke.js";
const fade_in = (selector) => {
  $$(selector).forEach((e) => {
    e.style.opacity = 0;
    e.style.transform = "translateY(20px)";
    setTimeout(
      () => ((e.style.opacity = 1), (e.style.transform = "translateY(0px)")),
      1,
    );
  });
};

export { fade_in };
