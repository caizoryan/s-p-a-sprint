import { _ } from "./scripts/hyperaxe.js";
import { mounted } from "./solid_monke/solid_monke.js";
import { fade_in } from "./transitions.js";

let { div, p, h1, br } = _;

export let About = () => {
  let first = column(team(), serivces(), contact());
  return _("div.about")(description, first);
};

let column = (...el) => {
  return _("div.about__column")(el);
};

let team = () => {
  mounted(() => fade_in(".about__team"));

  let name = _("div.about__name");

  let mom = div(
    name("Pallavi Pashine"),
    p("Principal Architect of SPA here is some stuff does "),
  );
  let dad = div(name("Anurag Pashine"));

  return _("div.about__team")(h1("Team"), mom, dad);
};

let contact = () => {
  mounted(() => fade_in(".about__contact"));
  let contact = [
    "Address: 1st Floor, Pashine House, 1st Lane, Pratap Nagar, Nagpur, Maharashtra 440022",
    "Phone: 0712 224 0000",
    "Email: archspangp@gmail.com",
  ];

  let contact_element = (c) => p(c);
  let contact_elements = contact.map(contact_element);

  return _("div.about__contact")(h1("Contact"), contact_elements);
};

let serivces = () => {
  mounted(() => fade_in(".about__services"));
  let service_list = ["Architecture", "Interior Design", "Project Management"];

  let service = (s) => p(s);
  let service_elements = service_list.map(service);

  return _("div.about__services")(h1("Services"), service_elements);
};

let description = () => {
  mounted(() => fade_in(".about__description"));
  let description = _("div.about__description-text");
  let description_text =
    "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";

  return _("div.about__description")(div(), description(description_text));
};
