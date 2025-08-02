import sql from "mssql";
import { configDotenv } from "dotenv";

configDotenv();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export const databaseConfig = async() => {
    try{
        await sql.connect(config);
        console.log("connected to DB");
    }
    catch(error){
        console.log("Error in connecting with Database: " + error.message);
    }
}

export const dbReq = new sql.Request();