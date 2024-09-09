import { html, mem, mounted, sig } from "../solid_monke/solid_monke.js";
import { data } from "../data/data.js";
import { page } from "../router.js";
import { fade_in } from "../utils/transitions.js";

let found = data.projects.find((e) => e.title.toLowerCase().includes("mukewar"))
window.addEventListener("resize", () => width.set(window.innerWidth))
let width = sig(window.innerWidth);
let index = mem(() => width() > 800 ? 0 : 1);
let img = mem(() => found.images[index()].image.original.url)

let random_index = () => Math.floor(Math.random() * data.projects.length);

let alt_img = mem(() => data.projects[random_index()].images[0].image.original.url);


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
  let click = () => {
    page("/work?" + link)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  };;
  return html`
    .home__category [onclick=${click}] -- ${name}`;
}

export const Home = () => {
  mounted(() => {
    fade_in(".home__work", 1000)
    fade_in(".home__landing", 600)
    fade_in(".home__shadow", 800)
  });


  return html`
    .home
      .home__landing
        img [src=${img}]
        .home__shadow
      .home__work
        .home__subtitle -- Featured Projects
        .home__categories
          each of ${categories} as ${Category}
    `;

}
