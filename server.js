import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public"));
app.all("/*", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.listen(7777, () => console.log("Server is running on port 7777"));
