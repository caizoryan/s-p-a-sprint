import { h } from "../solid_monke/solid_monke.js";

const html_tags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
];
const tags = html_tags;
let instances;

/**
 * Returns an element factory using the given createElement function.
 * Adapted from `lib/create-x.js` in jxnblk's https://github.com/jxnblk/reaxe.
 * Only tested with hyperscript. Not guaranteed to work with anything else.
 *
 * @param  {Function} fn - createElement function
 * @return {Function} - factory function with all HTML tag factories attached
 */
function createFactory(fn) {
  function factory(tag) {
    return function(props) {
      return isObject(props)
        ? fn(tag, props, sliceKids(arguments, 1))
        : fn(tag, sliceKids(arguments));
    };
  }

  tags.forEach(function(tag) {
    factory[tag] = factory(tag);
  });

  return factory;
}

/**
 * Return an element factory function, either by creating a new one or by
 * getting a cached version
 *
 * @param  {Function} fn - createElement function
 * @return {Function} - factory function with all HTML tag factories attached
 */
function getFactory(fn) {
  if (!instances) {
    instances = new Map();
  }

  let factory = instances.get(fn);
  if (factory) {
    return factory;
  }

  factory = createFactory(fn);
  instances.set(fn, factory);
  return factory;
}

/**
 * Turns arguments into an array, optionally slicing off a portion.
 * @param  {array} args - arguments object (array-like)
 * @param  {number} num - optional integer for Array.slice
 * @return {array} - array of arguments
 */
function sliceKids(args, num) {
  const arr = Array.prototype.slice.call(args, num);
  return arr;
}

function isObject(val) {
  return val != null && typeof val === "object" && Array.isArray(val) === false;
}

export const x = createFactory(h);

// module.exports.createFactory = createFactory
// module.exports.getFactory = getFactory
