import {Client} from "pg";
import { configDotenv } from "dotenv";

configDotenv();

const dbClient = new Client();

export default dbClient;