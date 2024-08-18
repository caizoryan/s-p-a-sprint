import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public"));
app.all("/*", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/ass", (_, res) => res.send("fuck vercel"));
app.listen(3001, () => console.log("Server is running on port 3001"));

export default app;
