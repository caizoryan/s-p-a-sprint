import { filters, filter_map } from "./data.js";
import { q } from "../../utils/qs.js";
import { sig } from "../../solid_monke/solid_monke.js";
import { page } from "../../router.js";

export let refresh = () => {
  let filter_qs = { f: filters().map((f) => f.name) };

  if (window.location.href.includes("/work")) {
    let r = q.stringify(filter_qs);
    setTimeout(() => page("/work?" + r), 10);
  }
}

export const disable_all = (type) => filter_map.data.forEach((r) => r.type === type ? (r.enabled = false) : null)

export const show_filters = () => {

  const s = localStorage.getItem("show_filters") || "true";
  const parseBool = (s) => s === "true";
  const show = sig(parseBool(s));

  const toggle = () => { show.set(!show()); localStorage.setItem("show_filters", show()); };
  show.toggle = toggle;

  return show

}

const large = (p) => p.image.large.url;

export const clean_project = (p) => {
  let _p = { ...p };
  _p.title = _p.title.split("—")[1];
  _p.image = _p.images.map(large)[0];
  _p.sub_type = _p.sub_type.map((s) => s.toLowerCase());
  _p.type = _p.type.map((s) => s.toLowerCase());
  return _p;
};
