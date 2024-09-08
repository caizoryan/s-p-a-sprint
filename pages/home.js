import { html, mem, sig } from "../solid_monke/solid_monke.js";
import { data } from "../data/data.js";
import { page } from "../router.js";

let found = data.projects.find((e) => e.title.toLowerCase().includes("mukewar"))
window.addEventListener("resize", () => width.set(window.innerWidth))
let width = sig(window.innerWidth);
let index = mem(() => width() > 800 ? 0 : 1);
let img = mem(() => found.images[index()].image.original.url)


// turn the above into an array of objects with name and link
let categories = [
  { name: "Architecture", link: "f=architecture" },
  { name: "Interior Design", link: "f=interior" },
  { name: "Residential", link: "f=residential" },
  { name: "Commercial", link: "f=commercial" },
  { name: "Hospitality", link: "f=hospitality" },
  { name: "Hospital", link: "f=hospital" },
  { name: "Office", link: "f=office" }
]

const Category = ({ name, link }) => {
  let click = () => page("/work?" + link);
  return html`
    .home__category [onclick=${click}] -- ${name}`;
}

export const Home = () => {
  return html`
    .home
      .home__landing
        img [src=${img}]
        .home__shadow
      .home__work
        .home__subtitle -- Featured Projects
        .home__projects
          each of ${categories} as ${Category}
    `;

}
