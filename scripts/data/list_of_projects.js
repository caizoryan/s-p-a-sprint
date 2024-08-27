import fs from "fs";
import { data } from "./data.js";

const projects = data.projects;
const names = projects.map(
  (project) =>
    project.title +
    `\n` +
    project.type.join(", ") +
    `\n` +
    project.sub_type.join(",") +
    `\n` +
    "(sq ft?)",
);

let txt = names.join(`\n\n`);

fs.writeFile("list_of_projects.txt", txt, (err) => {});
