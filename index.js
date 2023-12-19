import express from "express";
import http from "http";
import { Elier, LaGrange, Newton, bisection, rungeKutt } from "./functions.js";
import multer from "multer";
import cors from "cors";

const app = express();
app.use(cors());
app.post("/lagrange", multer().none(), LaGrange);
app.post("/newton", multer().none(), Newton);
app.post("/bisection", multer().none(), bisection);
app.post("/elier", multer().none(), Elier);
app.post("/runge", multer().none(), rungeKutt);

const PORT = 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.clear();
  console.log(`SERVER listening on port ${PORT}`);
});
