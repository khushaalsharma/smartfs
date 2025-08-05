import express, {request, response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

//managers


configDotenv();
const router = express.Router();

router.use(express.json());
// router.use(session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false
// }));
router.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded(
    {
        extended: true
    }
));
router.use(cookieParser());



export default router;