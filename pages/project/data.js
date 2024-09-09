
import { filter_map_data, sqft } from "./filters.js";
import { sig, mut, mem, eff_on } from "../../solid_monke/solid_monke.js";
import { fade_in } from "../../utils/transitions.js";

export let filter_map = mut({ data: filter_map_data });

let enabled = () => filter_map.data.filter((f) => f.enabled).map((f) => f.filter);

export let filters = mem(() => [sqft, ...enabled()]);

export const filter_grouped = mem(() =>
  Object.entries(filter_map.data.reduce((acc, f) => {
    acc[f.type] = acc[f.type] || [];
    acc[f.type].push(f);
    return acc;
  }, {})));

export let projects = sig([]);

export let filtered_projects = mem(() => filters().reduce((acc, f) => f(acc), projects()));

eff_on(filters, () => fade_in(".project"));
