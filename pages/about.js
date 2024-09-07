import { mounted, html as h } from "../solid_monke/solid_monke.js";
import { fade_in } from "../utils/transitions.js";
import { data } from "./about/data.js";

export let About = () => {
  mounted(() => fade_in(".column"));

  let mom = { name: "Pallavi Pashine", description: "Principal Architect of SPA here is some stuff does" };
  let dad = { name: "Anurag Pashine", description: "Principal Architect of SPA here is some stuff does" };
  let description = "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";

  return h`
  .about

    .description
      .div
      .text -- ${description}

    .column

      div
        .about__subhead -- Services
        each of ${data.services} as ${s => h`div.about__subhead -- ${s}`}

      div
        .about__subhead -- Contact
        each of ${data.contact} as ${c => h`p -- ${c}`}

      div
        .about__subhead -- Clients
        each of ${data.clients} as ${c => h`p -- ${c}`}

      div
        .about__subhead -- Communications
        each 
          of ${data.communications} 
          as ${c => h`p > a [href= ${c.href}] -- ${c.name}`}

      div
        h1 -- Team
        .about__subhead -- ${mom.name}
        p -- ${mom.description}

        .about__subhead -- ${dad.name}
        p -- ${dad.description}

      div
        .about__subhead -- Consultants
        each of ${data.consultants} as ${n => h`p -- ${n}`}
`

};
