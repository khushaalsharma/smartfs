import sql from "mssql";
import { configDotenv } from "dotenv";

configDotenv();

export const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: 1433,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

let poolPromise;

export const databaseConfig = async() => {
    if(!poolPromise){
        try{
            poolPromise = await sql.connect(config);
            const data = await poolPromise.request().query("SELECT * FROM dbo.FileData");
            console.log("connected to DB");

            console.log(data);
        }
        catch(error){
            console.log("Error in connecting with Database: " + error.message);
            console.log(error);
        }
    }

    return poolPromise;
}

export {sql};