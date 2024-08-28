import { x } from "../scripts/hyperaxe.js";
import { mounted } from "../solid_monke/solid_monke.js";
import { fade_in } from "../utils/transitions.js";

let { div, p, h1, a } = x;

let data = {};

data.services = ["Architecture", "Interior Design", "Project Management"];

data.contact = [
  "Address: 1st Floor, Pashine House, 1st Lane, Pratap Nagar, Nagpur, Maharashtra 440022",
  "Phone: 0712 224 0000",
  "Email: archspangp@gmail.com",
];

data.clients = [
  "Microsoft",
  "Tata Consultancy",
  "IT Park",
  "Infosys",
  "Wipro",
  "Tech Mahindra",
  "HCL",
  "IBM",
  "Cognizant",
  "Persistent",
  "Apple",
];
data.communications = [
  { href: "https://www.facebook.com/anuragpallavi", name: "Facebook" },
  {
    href: "https://https://www.instagram.com/salankarpashine_designs",
    name: "Instagram",
  },
];
data.network = [
  "Jaguar Water Heaters",
  "Havells",
  "Anchor",
  "Philips",
  "Honeywell",
];

data.jobs;

export let About = () => {
  let first = column(team(), serivces(), contact());
  let second = column(clients(), communications(), network());
  return x("div.about")(description, first, second);
};

let column = (...el) => {
  return x("div.about__column")(el);
};

let description = () => {
  mounted(() => fade_in(".about__description"));
  let description = x("div.about__description-text");
  let description_text =
    "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";

  return x("div.about__description")(div(), description(description_text));
};

let clients = () => {
  mounted(() => fade_in(".about__clients"));

  let client = (c) => p(c);
  let client_elements = data.clients.map(client);

  return x("div.about__clients")(h1("Clients"), client_elements);
};

let communications = () => {
  mounted(() => fade_in(".about__communications"));

  let communication = (c) => a(c, p(c.name));
  let communication_elements = data.communications.map(communication);

  return x("div.about__communications")(
    h1("Communications"),
    communication_elements,
  );
};

let network = () => {
  mounted(() => fade_in(".about__network"));

  let network = (n) => p(n);
  let network_elements = data.network.map(network);

  return x("div.about__network")(h1("Network"), network_elements);
};

let team = () => {
  mounted(() => fade_in(".about__team"));

  let name = x("div.about__subhead");

  let mom = div(
    name("Pallavi Pashine"),
    p("Principal Architect of SPA here is some stuff does "),
  );
  let dad = div(name("Anurag Pashine"));

  return x("div.about__team")(h1("Team"), mom, dad);
};

let contact = () => {
  mounted(() => fade_in(".about__contact"));

  let contact_element = (c) => p(c);
  let contact_elements = data.contact.map(contact_element);

  return x("div.about__contact")(h1("Contact"), contact_elements);
};

let serivces = () => {
  mounted(() => fade_in(".about__services"));

  let services = x("div.about__subhead");
  let service = (s) => services(s);
  let service_elements = data.services.map(service);

  return x("div.about__services")(h1("Services"), service_elements);
};
