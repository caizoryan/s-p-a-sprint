// spec
// element := tag | attr[] | children[]
// tag := string
// attr := {key:value}
// children := element
//
// doc starts with element
// if attrs, they start with [], inside which are key value pairs separated by =
// if text starts with --
// if text is multiline, then will start with --- and end with ---
// children based on indentation
import { h as f } from "../solid_monke/solid_monke.js";
export function hh(strings, ...values) {
    // make them one array
    let arr = strings.reduce((acc, str, i) => {
        //@ts-ignore
        acc.push(str);
        if (values[i]) {
            //@ts-ignore
            acc.push({ value: values[i], type: "expression" });
        }
        return acc;
    }, []);
    let parser = new Parser(arr);
    let ast = parser.parse();
    return ast;
}
export function h(strings, ...values) {
    // make them one array
    let arr = strings.reduce((acc, str, i) => {
        //@ts-ignore
        acc.push(str);
        if (values[i]) {
            //@ts-ignore
            acc.push({ value: values[i], type: "expression" });
        }
        return acc;
    }, []);
    let parser = new Parser(arr);
    let ast = parser.parse();
    return converAstToHyperscript(ast);
}
// imagine this is hyperscript for now, you can use
// hyper("div", { class: "container" }, [p("hello", "world")])
let hyper = f;
function converAstToHyperscript(ast) {
    let ret = [];
    ast.forEach((element) => {
        let children = element.children.length > 0 ? converAstToHyperscript(element.children) : [];
        if (element.tag == "text" || element.tag == "expression") {
            //@ts-ignore
            ret.push(element.value);
        }
        else {
            console.log("children", children);
            ret.push(hyper(element.tag, element.attrs, children));
        }
    });
    return ret;
}
class Parser {
    constructor(data) {
        this.data = data;
        this.index = 0;
        this.current = this.data[this.index];
        this.ast = [];
        this.cursor = 0;
    }
    peekNext() {
        if (this.index >= this.data.length)
            return undefined;
        else {
            let i = this.index;
            let peek = i + 1;
            let peeked = this.data[peek];
            return peeked;
        }
    }
    ended() {
        if (!this.char() && !this.peekNext())
            return true;
        else
            return false;
    }
    next() {
        if (this.index >= this.data.length)
            return undefined;
        else {
            this.index++;
            this.current = this.data[this.index];
            this.cursor = 0;
            return this.current;
        }
    }
    recursivelyCheckChildrenIndentAndAdd(element, last) {
        let compare = last;
        while (compare.children.length > 0) {
            let compareBuffer = compare.children[compare.children.length - 1];
            if (!compareBuffer)
                break;
            if (element.indent > compareBuffer.indent) {
                compare = compareBuffer;
            }
            else {
                break;
            }
        }
        compare.children.push(element);
    }
    parse() {
        while (!this.ended()) {
            let element = this.parseElement();
            let ast_last = this.ast[this.ast.length - 1];
            if (element) {
                console.log("element:", element.tag, element.indent);
                console.log("ast_last:", ast_last === null || ast_last === void 0 ? void 0 : ast_last.tag, ast_last === null || ast_last === void 0 ? void 0 : ast_last.indent);
                if (ast_last && element.indent > ast_last.indent) {
                    this.recursivelyCheckChildrenIndentAndAdd(element, ast_last);
                }
                else {
                    this.ast.push(element);
                }
            }
            else
                break;
        }
        return this.ast;
    }
    parseElement() {
        let indent = 0;
        let tag = "";
        let attrs = {};
        let children = [];
        if (this.ended())
            return undefined;
        if (typeof this.current === "string") {
            indent = this.parseIndent();
        }
        if (typeof this.current === "string") {
            this.eatEmpty();
            tag = this.parseTag();
            if (tag === "")
                return undefined;
        }
        attrs = this.parseAttrs();
        children = this.parseText();
        return {
            tag,
            attrs,
            children,
            indent,
        };
    }
    parseText() {
        let ret = [];
        let text = "";
        this.eatWhitespace();
        if (this.char() === "-") {
            this.eat();
            if (this.char() === "-") {
                this.eat();
                this.eatWhitespace();
                while (this.char() !== `\n`) {
                    // if this.char() === undefined, then we have reached the end of the string
                    // if next is expression, add text to ret, then add expression and keep going till terminated by \n
                    if (this.char() === undefined) {
                        ret.push(this.makeTextElement(text));
                        text = "";
                        let next = this.next();
                        if (next === undefined)
                            break;
                        if (typeof next !== "string") {
                            ret.push(this.makeExpressionElement(next.value));
                            this.next();
                        }
                    }
                    else {
                        text += this.eat();
                    }
                }
                if (text !== "")
                    ret.push(this.makeTextElement(text));
            }
        }
        return ret;
    }
    makeExpressionElement(value) {
        return {
            tag: "expression",
            children: [],
            indent: 0,
            attrs: {},
            value
        };
    }
    makeTextElement(value) {
        return {
            tag: "text",
            children: [],
            indent: 0,
            attrs: {},
            value
        };
    }
    eatWhitespace() {
        while (this.current[this.cursor] === " ") {
            this.cursor++;
        }
    }
    eatNewline() { }
    eatEmpty() {
        while (this.char() === " " || this.char() === "\n" || this.char() === "\t") {
            this.eat();
        }
    }
    char() {
        return this.current ? this.current[this.cursor] : undefined;
    }
    eat() {
        let char = this.current[this.cursor];
        this.cursor++;
        return char;
    }
    parseAttrs() {
        this.eatWhitespace();
        if (this.current[this.cursor] !== "[") return {};

        else {
            let attrs = {};
            this.cursor++;

            while (this.char() !== "]") {

                let key = "";
                let value = "";
                this.eatEmpty();

                if (this.char() === undefined) {
                    let next = this.next();
                    if (next === undefined) throw new Error("Invalid attribute");
                    if (typeof next !== "string") {
                        key = next.value;
                        this.next();

                        if (this.char() === "=") this.eat();
                        else throw new Error("Should have =");
                    } else {
                        key = this.parseKey();
                    }
                } else {
                    key = this.parseKey();
                } this.eatEmpty();
                if (this.char() === undefined) {
                    let next = this.next();
                    if (next === undefined)
                        throw new Error("Invalid attribute");
                    if (typeof next !== "string") {
                        value = next.value;
                        this.next();
                    }
                    else {
                        value = this.parseValue();
                    }
                } else {
                    value = this.parseValue();
                } this.eatEmpty();

                attrs[key] = value;
            }

            this.eat();
            return attrs;
        }
    }
    parseKey() {
        let key = "";
        this.eatWhitespace();
        while (this.char() !== "=" && this.current.length > this.cursor) {
            key += this.eat();
        }
        this.eat();
        this.eatWhitespace();
        return key.trim();
    }
    parseValue() {
        let value = "";
        this.eatWhitespace();
        while (this.char() !== " ") {
            if (this.char() === undefined)
                break;
            if (this.char() === "]") {
                this.eat;
                break;
            }
            value += this.eat();
        }
        this.eatWhitespace();
        return value.trim();
    }
    parseIndent() {
        let i = 0;
        while (this.char() === " " || this.char() === "\t" || this.char() === "\n") {
            if (this.char() === " ")
                i++;
            if (this.char() === "\t")
                i += 2;
            if (this.char() === "\n")
                i = 0;
            this.cursor++;
        }
        return i;
    }
    parseTag() {
        let tag = "";
        while (this.char() !== " " && this.char() !== "\n" && this.char() !== "\t" && this.char() !== "[" && this.char() !== undefined) {
            tag += this.eat();
        }
        return tag;
    }
    cursorCheck() {
        if (this.cursor >= this.current.length) {
            this.next();
        }
    }
}
