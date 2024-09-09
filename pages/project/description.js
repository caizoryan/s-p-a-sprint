import { filter_map, filtered_projects } from "../project.js";
import { mem } from "../../solid_monke/solid_monke.js";

let filtered_count = mem(() => filtered_projects().length);

let enabled_type = mem(() => filter_map.data.filter((f) => f.type === "type").find((f) => f.enabled));
let enabled_sub_type = mem(() => filter_map.data.filter((f) => f.type === "sub_type").find((f) => f.enabled));

export const description_text = mem(() => {
  let words = [];

  let t = enabled_type()?.name
  let s = enabled_sub_type()?.name

  if (!t && !s) return "Showing all projects";
  if (s) words.push(s);
  if (t) words.push(t);

  return "Showing " + "(" + filtered_count() + ") " + words.join(", ") + " projects";
});
