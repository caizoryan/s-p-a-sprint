import { html as h, mounted } from "../solid_monke/solid_monke.js";
import { fade_in } from "../utils/transitions.js";
import { easter_egg_click } from "../utils/colorschemes.js";
import { filter_map, filtered_projects, filter_grouped, projects } from "./project/data.js";
import { description_text } from "./project/description.js";
import { refresh, disable_all, clean_project, show_filters } from "./project/utils.js";
export { filter_map, filtered_projects }

/* ===============================
   Project
   =============================== */

const FilterButton = (f) => {
  const toggle = () => { disable_all(f.type); f.enabled = !f.enabled; refresh(); };

  return h`
    button.filter-button [
      onclick = ${toggle}
      active = ${() => f.enabled} ] -- ${f.name}`;
};

const FilterBox = () => {

  const show = show_filters();
  const classes = () => "filter-box " + (show() ? "show" : "hide");

  const Category = ([category, filter]) => h`
    div
      p -- ${category}
      each of ${filter} as ${FilterButton}`


  return h`
    button.filter-box-toggle [ onclick = ${show.toggle} ] -- filters

    div [ class=${classes} ]
      button.close [ onclick=${show.toggle} ] -- x

      #each 
        of -- ${filter_grouped} 
        as -- ${Category}`;
};

const Project = ({ image, title, type, sub_type }) => {
  let easteregg = easter_egg_click(title);
  return h`
  .project [onclick=${easteregg}]

    .project__img 
      img [ src = ${image} ]

    .project__metadata
      .project__title -- ${title}
      .project__type -- [ ${type.join(" & ")} ]
      .project__sub-type -- [ ${sub_type.join(", ")} ]`
};


export const Projects = (p) => {
  mounted(() => fade_in(".projects"));
  projects.set(p.map(clean_project));

  return h`
    .filters -- ${FilterBox}

    .projects__showing
      .empty-div 
      .projects__showing-text -- ${description_text}

    .projects
      each of ${filtered_projects} as ${Project}`;
};


