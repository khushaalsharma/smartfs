import express from "express";
import dbClient from "./utils/config.db.js";

const app = express();

dbClient.connect()
        .then(() => {
            console.log("connection successful!");
        })
        .catch((err) => console.error("error in connecting", err));

app.listen(5000,() => {
    console.log("Server started");
})