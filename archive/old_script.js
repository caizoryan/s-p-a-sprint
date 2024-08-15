import {
  img,
  each,
  div,
  render,
  eff,
  sig,
  inn,
  span,
  mem,
  eff_on,
  $$,
  $,
  p,
  if_then,
  when,
} from "./solid_monke/solid_monke.js";
import { data } from "./data.js";
import { createMutable } from "./solid_monke/store/store.js";

let projects = data.projects;

const project_fullscreen = sig(false);

const short_filter = (arr) => arr.slice(0, 6);
const randomise_filter = (arr) =>
  arr.sort(() => (Math.random() > 0.5 ? -1 : 1));
const architecture_filter = (arr) =>
  arr.filter((x) => x.type.includes("architecture"));
const interior_filter = (arr) => arr.filter((x) => x.type.includes("interior"));
const residential_filter = (arr) =>
  arr.filter((x) =>
    x.sub_type.map((r) => r.toLowerCase()).includes("residential"),
  );
const commercial_filter = (arr) =>
  arr.filter((x) =>
    x.sub_type.map((r) => r.toLowerCase()).includes("commercial"),
  );
const hospitality_filter = (arr) =>
  arr.filter((x) =>
    x.sub_type.map((r) => r.toLowerCase()).includes("hospitality"),
  );
const hospital_filter = (arr) =>
  arr.filter((x) =>
    x.sub_type.map((r) => r.toLowerCase()).includes("hospital"),
  );
const all_filter = (arr) => arr;

const filter_list = createMutable([
  {
    name: "all",
    set: false,
    show: true,
    func: all_filter,
    toggle: function() {
      if (this.set === true) this.set = false;
      else {
        this.set = true;
        filter_list.forEach((x) => {
          if (x.name !== "all") x.set = false;
        });
      }
    },
  },
  {
    name: "randomise",
    set: true,
    show: false,
    func: randomise_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "shorten",
    set: true,
    show: false,
    func: short_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "architecture",
    set: false,
    show: true,
    func: architecture_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "interior",
    set: false,
    show: true,
    func: interior_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "residential",
    set: false,
    show: true,
    func: residential_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "commercial",
    set: false,
    show: true,
    func: commercial_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "hospital",
    set: false,
    show: true,
    func: hospital_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
  {
    name: "hospitality",
    set: false,
    show: true,
    func: hospitality_filter,
    toggle: function() {
      this.set = !this.set;
    },
  },
]);

eff_on(project_fullscreen.is, () => {
  if (project_fullscreen.is() === true) {
    filter_list.forEach((x) => {
      x.set = false;
    });
    filter_list[0].set = true;
  }

  if (project_fullscreen.is() === false) {
    filter_list.forEach((x) => {
      x.set = false;
    });
    filter_list.filter((x) => x.name === "shorten")[0].set = true;
    filter_list.filter((x) => x.name === "randomise")[0].set = true;
  }

  inn(10, () => {
    $$(".hidden-project").forEach((x) => {
      x.classList.remove("hidden-project");
    });
  });
});

let filters = mem(() => {
  let f = filter_list.filter((x) => x.set).map((x) => x.func);
  return f;
});

eff_on(filters, () => {
  if (project_fullscreen.is() === false) return;

  // $$(".project").forEach((x) => {
  //   x.classList.add("hidden-project");
  // });

  inn(10, () => {
    $$(".project").forEach((x) => {
      x.classList.remove("hidden-project");
    });
  });
});

let project_set = mem(() => {
  let f = filters();
  let p = projects;
  if (f.length == 0) return p;
  else {
    for (let i = 0; i < f.length; i++) {
      p = f[i](p);
    }
  }

  return p;
});

let presss = data.press[0].images;

let images = new Map();

projects.forEach((p) => {
  p.images.forEach((img) => {
    let img_obj = new Image();
    img_obj.src = img.image.thumb.url;

    img_obj.onload = () => {
      images.get(img.url).loaded.set(true);
    };

    images.set(img.url, {
      image: img_obj,
      loaded: sig(false),
    });
  });
});

projects.forEach((p) => {
  p.images.forEach((img) => {
    let img_obj = new Image();
    img_obj.src = img.image.large.url;

    img_obj.onload = () => {
      images.get(img.url).loaded.set(true);
    };

    images.set(img.url, {
      image: img_obj,
      loaded: sig(false),
    });
  });
});

let show = sig("hide");
let showing = sig(projects[0].id);
let cur = sig(0);

const full_screen = () => {
  let img_list = mem(() =>
    projects.find((x) => x.id == showing.is()).images.map(large),
  );

  let cur_img = mem(() => img_list()[cur.is()]);
  let _class = mem(() => "project-full " + show.is());
  let next = () => cur.set((cur.is() + 1) % img_list().length);
  let prev = () =>
    cur.is() > 0 ? cur.set(cur.is() - 1) : cur.set(img_list().length - 1);

  eff(() => console.log(img_list()));
  eff(() => console.log(cur.is()));

  return div({ class: _class }, [
    img(cur_img),
    div(
      {
        class: "close",
        onclick: () => {
          show.set("hide");
          cur.set(0);
        },
      },
      "X",
    ),
    div({ class: "prev", onclick: prev }, "<"),
    div({ class: "next", onclick: next }, ">"),
  ]);
};

// basic
const project = (img_set, title, type, sub_type, id) => {
  let show_this = (i) => {
    show.set("show");
    showing.set(id);
    cur.set(i);
  };

  let scrolled = sig(false);
  let height = mem(() => ({
    height: scrolled.is() ? "20%" : "75%",
    // width: scrolled.is() ? "15%" : "35%",
  }));
  return div(
    { class: "project" },
    div(
      {
        class: "project-scroll",
        onscroll: (e) => {
          if (e.target.scrollLeft > 100) scrolled.set(true);
          if (e.target.scrollLeft < 100) scrolled.set(false);
        },
      },
      width("40%"),
      img_set.map((a, f) =>
        if_then(
          [
            images.get(a.url).loaded.is(),
            img(thumb(a), { onclick: (e) => show_this(f) }),
          ],
          [!images.get(a.url).loaded.is(), p("loading")],
        ),
      ),
    ),
    div(
      { class: "text-container", style: height },
      div({ class: "title" }, title.slice(1)),
      div({ class: "type" }, type, ", ", span({ class: "sub-type" }, sub_type)),
    ),
  );
};

const filterBox = () => {
  return div(
    { class: "filter-box" },
    each(filter_list, (f) => {
      if (f.show === false) return;
      return span(
        {
          class: mem(() =>
            f.set ? "filter filter-active" : "filter filter-inactive",
          ),
          onclick: () => {
            f.toggle();
          },
        },
        "[",
        f.name,
        "]",
      );
    }),
  );
};

const project_container = () => {
  return div(
    {
      class: mem(() =>
        project_fullscreen.is()
          ? "project-container full"
          : "project-container",
      ),
    },
    div(
      { class: "title-box" },
      "Featured Projects",
      span(
        {
          onclick: () =>
            project_fullscreen.is() === true
              ? project_fullscreen.set(false)
              : project_fullscreen.set(true),
        },
        if_then(
          [project_fullscreen.is() === false, "+"],
          [project_fullscreen.is() === true, "-"],
        ),
      ),
    ),
    when(project_fullscreen.is, [true, filterBox]),

    div({ class: "projects-gallery" }, () =>
      project_set().map((f) =>
        project(
          f.images,
          f.title,
          f.type.join(" & "),
          f.sub_type.join(" & "),
          f.id,
        ),
      ),
    ),

    div({ class: "show-all" }, "Show All Projects >"),
  );
};

const press_title = (title) => title.split(".")[0].replace(/_/g, " ");

const press = (img_url, title) => {
  return div(
    { class: "press-box hidden-press" },
    img(img_url),
    div(
      { class: "text-container" },
      div({ class: "title" }, press_title(title)),
    ),
  );
};

const press_container = () => {
  return div(
    { class: "press-container" },
    div({ class: "title-box" }, "Press"),
    div(
      { class: "press-gallery" },
      presss.map((f) => press(f.image.large.url, f.title)),
    ),
  );
};

const height = (val) => div({ style: { "min-height": val } });
const width = (val) => div({ class: "spacer", style: { width: val } });

const landing = () => {
  return div(
    { class: "landing" },
    div({ class: "title" }, "Salankar Pashine & Associates"),
    div(
      { class: "menu" },
      span(
        {
          class: "menu-item",
        },
        "[ Our Work ]",
      ),
      span(
        {
          class: "menu-item",
        },
        "[ About Us ]",
      ),
    ),
    div(
      { class: "contact" },
      div(
        { class: "address" },
        p("01, RPTS Rd, Laxminagar,"),
        p("Nagpur, Maharashtra, 440022"),
      ),

      div({ class: "phone" }, p("+91 712 222 2222"), p("archspangp@gmail.com")),
    ),
  );
};

const bottom = () => {
  return div(
    { class: "about" },
    div({ class: "title" }, "Salankar Pashine & Associates"),
    div(
      { class: "menu" },
      span({ class: "menu-item" }, "[ Our Work ]"),
      span({ class: "menu-item" }, "[ About Us ]"),
    ),
    div(
      { class: "contact" },
      div(
        { class: "address" },
        p("01, RPTS Rd, Laxminagar,"),
        p("Nagpur, Maharashtra, 440022"),
      ),

      div({ class: "phone" }, p("+91 712 222 2222"), p("archspangp@gmail.com")),
    ),
  );
};

const mother = () => {
  return div(
    { class: "mother" },
    landing,
    () => height("40vh"),
    project_container,
    press_container,
    full_screen,
  );
};

// Utils
const large = (i) => i.image.large.url;
const thumb = (i) => i.image.thumb.url;

render(() => mother, document.body);

inn(10, () => {
  let observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("hidden-project");
        }
      }),
    {
      root: $(".mother"),
      threshold: 0.2,
    },
  );

  $$(".project").forEach((div) => {
    observer.observe(div);
  });
});

inn(20, () => {
  let observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("hidden-press");
        }
      }),
    {
      root: $(".mother"),
      threshold: 0.1,
    },
  );

  $$(".press-box").forEach((div) => {
    observer.observe(div);
  });
});
