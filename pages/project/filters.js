let architecture = (arr) =>
  [...arr].filter((p) => p.type.includes("architecture"));
let interior = (arr) => [...arr].filter((p) => p.type.includes("interior"));

let hospital = (arr) => [...arr].filter((p) => p.sub_type.includes("hospital"));
let hospitality = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("hospitality"));
let residential = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("residential"));
let commercial = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("commercial"));
let office = (arr) =>
  [...arr].filter((p) => p.sub_type.includes("office"));

export let filter_map_data = [
  {
    name: "architecture",
    filter: architecture,
    type: "type",
    enabled: false,
  },
  { name: "interior", filter: interior, type: "type", enabled: false },

  { name: "hospital", filter: hospital, type: "sub_type", enabled: false },

  {
    name: "hospitality",
    filter: hospitality,
    type: "sub_type",
    enabled: false,
  },
  {
    name: "residential",
    filter: residential,
    type: "sub_type",
    enabled: false,
  },
  {
    name: "commercial",
    filter: commercial,
    type: "sub_type",
    enabled: false,
  },
  {
    name: "office",
    filter: office,
    type: "sub_type",
    enabled: false,
  }
]

export let sqft = (arr) => [...arr].sort((a, b) => b.sqft - a.sqft);
