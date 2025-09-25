import express from "express";
import { databaseConfig } from "./utils/config.sql.js";
import qdrantConfig from "./utils/config.qdrant.js";
//routes
import userRoute from "./routes/user.route.js";
import fileRoute from "./routes/file.route.js";

//code
const app = express();

//routes dependencies
app.use("/user", userRoute);
app.use("/file", fileRoute);

//database connections
await databaseConfig();
await qdrantConfig();


app.listen(5000,() => {
    console.log("Server started");
})