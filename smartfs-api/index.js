import express from "express";
import { databaseConfig } from "./utils/config.db.js";

//routes
import userRoute from "./routes/user.route.js";

const app = express();

app.use("/user", userRoute);

await databaseConfig();


app.listen(5000,() => {
    console.log("Server started");
})