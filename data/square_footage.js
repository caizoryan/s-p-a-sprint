import fs from 'fs';
let host = "https://api.are.na/v2/";

let sqft = `— Adhlakhia Hospital and Residence, hospital	35,000 sq.ft.
— Adisun Elite, Residential	18,000 sq.ft.
— Andaman Villa, Residential	3000 sq. ft.
— Awchat Residence, residential	5,000 sq. ft.
— Bachwani Residence, Residential	5,000 sq.ft.
— Bhave Institute of Mental Health, hospital	75,000 sq.ft.
— Byjus Office 2021, office	20,000 sq.ft.
— Byjus Office 2022, office	10,000sq.ft.
— Dara Residence, residential	10,000 sq. ft.
— Dr Garg Clinic, Hospital	4000 sq. ft.
— Fatehpuria Residence, residential	18,000 sq.ft.
— Java Cafe, hospitality	2000 sq.ft.
— Khabiya Residence, residential	1800 sq.ft.
— Mother Care Nursing, hospital	3,000 sq.ft.
— Mukewar Farmhouse, Residential	4,000 sq. ft.
— Pashine Residence, residential	1800 sq.ft.
— Perficient Cafe,Hospitality	10,000 sq. ft.
— Perficient Office, office	25,000 sq.ft.
— Satish Saree, commercial	4000 sq.ft.
— Seller Drive, office	4000 sq.ft.
— Merlion Club	60,000 sq.ft.
— Ultratech Office	10,000 sq.ft.
— Altair, residential	3,00,000 sq.ft
— Budhwaar Bazaar, commercial,hospital	5,00,000 sq.ft.
— Navrang 27	3,00,000 sq.ft.
— PCH Hospital	65,000 sq.ft.
— Luxuria	1,80,000 sq.ft.
— Metro Crazy Castle commercial,office	
— VR Nexus	1,50,000 sq.ft.
─  Capital	3,75,000 sq.ft.`

import { data } from './data.js';

let projects = data.projects;

// split the sqft by \n and seperate further by tab
//
let cleaned = sqft.split('\n').map(e => (
  {
    title: e.split('\t')[0].split(',')[0].trim(),
    sqft: (e.split('\t')[1])?.replace(/[^0-9]/g, '')
  }
));

cleaned.forEach(e => {
  let project = projects.find(p => p.title === e.title);
  if (project) {
    project.sqft = e.sqft;
  }
});

let auth = 'AR8bT4Qm7_OSqK_msk_s1erLeesL4Dd6WdSGerWVQKQ'

const add_block = (slug, title, content) => {
  fetch(host + "channels/" + slug + "/blocks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    },
    method: "POST",
    body: JSON.stringify({
      content: content,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let block_id = data.id;
      // TODO: better way to do this
      if (title !== "") update_block(block_id, { title: title }, slug);
    });
};

let count = 0

export const update_block = (block_id, body) => {
  fetch(host + `blocks/${block_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    },
    method: "PUT",
    body: JSON.stringify(body),
  }).then((response) => {
    count++;
    console.log(response.ok, " ", block_id, " ", count)
  });
};

projects.forEach(p => {
  if (!p.sqft) {
    console.log(p.title, " has no sqft");
  }

  if (p.sqft) {
    add_block(p.id, "sqft", p.sqft);
  }
})

fs.writeFileSync('./projects.json', JSON.stringify(projects, null, 2));



