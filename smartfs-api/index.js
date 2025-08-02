import express from "express";
import { databaseConfig } from "./utils/config.db.js";

const app = express();

await databaseConfig();


app.listen(5000,() => {
    console.log("Server started");
})