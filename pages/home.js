import { html } from "../solid_monke/solid_monke.js";
import { data } from "../data/data.js";

let found = data.projects.find((e) => e.title.toLowerCase().includes("mukewar"))
console.log(found);

let width = window.innerWidth;
let index = width > 800 ? 0 : 1;

let img = found.images[index].image.original.url;
console.log(img);

export const Home = () => {
  return html`
    .home
      .home__landing
        img [src=${img}]
        .home__shadow
    `;

}
