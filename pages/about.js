import { mounted, html as html } from "../solid_monke/solid_monke.js";
import { fade_in } from "../utils/transitions.js";
import { data } from "./about/data.js";

export let About = () => {
  mounted(() => {
    fade_in(".column", 800)
    fade_in(".main", 500)
    fade_in(".consultants", 400)
    fade_in(".description", 300)
  });

  let description = "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";

  // div
  //   .about__subhead -- Services
  //   each of ${data.services} as ${s => html`div.about__subhead -- ${s}`}
  let consultant = n => {
    return html`
.consultant
    .img-container
      img [src=${"./people/" + n.filename}]
    p -- ${n.name}`
  };

  return html`
  .about

    .description
      .div
      .text -- ${description}


    .team
      .main
        h1 -- Principal Architects
        img [src=./people/anurag_pallavi.png]
        .about__subhead -- Anurag & Pallavi Pashine

      .consultants
        h1 -- Consultants
        .consultants-container
          each of ${data.consultants} as ${consultant}

    .column

      div
        .about__subhead -- Clients
        each of ${data.clients} as ${c => html`p -- ${c}`}

      div
        .about__subhead -- Contact
        each of ${data.contact} as ${c => html`p -- ${c}`}


      div
        .about__subhead -- Communications
        each 
          of ${data.communications} 
          as ${c => html`p > a [href= ${c.href}] -- ${c.name}`}
`

};
