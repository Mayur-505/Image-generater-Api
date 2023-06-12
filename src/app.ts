var bodyParser = require("body-parser");
import express, { Application } from "express";
import cors from "cors";
import router from "./routes";
import { ValidationError } from "express-validation";

const app: Application = express();
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb", type: "application/json" }));
app.use(express.static("public/"));
app.use(router);
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }

    return res.status(500).json(err);
});

export default app;