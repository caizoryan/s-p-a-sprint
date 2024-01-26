let projects_fetch = await fetch(
  "https://api.are.na/v2/channels/projects-9gn8-7a04c4?per=100",
  {
    headers: {
      Authorization: "Bearer AR8bT4Qm7_OSqK_msk_s1erLeesL4Dd6WdSGerWVQKQ",
    },
  },
)
  .then((res) => res.json())
  .then((res) => res.contents);

let projects = [];

for (let i = 0; i < projects_fetch.length; i++) {
  await get_channel(projects_fetch[i].id).then((res) => {
    console.log(res.title);
    projects.push(res);
  });
}

let press_fetch = await fetch(
  "https://api.are.na/v2/channels/press-x28lxexyowi?per=100",
  {
    headers: {
      Authorization: "Bearer AR8bT4Qm7_OSqK_msk_s1erLeesL4Dd6WdSGerWVQKQ",
    },
  },
)
  .then((res) => res.json())
  .then((res) => res.contents);
let press = [];

for (let i = 0; i < press_fetch.length; i++) {
  await get_channel(press_fetch[i].id).then((res) => {
    console.log(res.title);
    press.push(res);
  });
}

const data = {
  projects: format_projects(projects),
  press: format_press(press),
};

//
await Bun.write(
  "data.js",
  "export const data = " + JSON.stringify(data, null, 2) + ";",
);
//

function format_projects(projects) {
  return projects.map((p) => {
    let title = p.title;
    let id = p.id;

    let completed = p.contents.find((x) => x.title == "completed")?.content;

    let type = p.contents
      .filter((x) => x.title == "type")
      .map((x) => x.content);
    let sub_type = p.contents
      .filter((x) => x.title == "sub_type")
      ?.map((x) => x.content);

    let images = p.contents
      .filter((x) => x.class == "Image")
      .map((i) => ({
        title: i.title,
        image: i.image,
      }));

    return { title, type, id, images, sub_type, completed };
  });
}

function format_press(press) {
  return press.map((p) => {
    let category = p.title;
    let id = p.id;

    let images = p.contents
      .filter((x) => x.class == "Image")
      .map((i) => ({
        title: i.title,
        image: i.image,
      }));

    return { id, category, images };
  });
}

// -------------------------
// UTILS
async function get_channel(id) {
  let project = await fetch(
    "https://api.are.na/v2/channels/" + id + "?per=100",
    {
      headers: {
        Authorization: "Bearer AR8bT4Qm7_OSqK_msk_s1erLeesL4Dd6WdSGerWVQKQ",
      },
    },
  ).then((res) => res.json());

  return project;
}
