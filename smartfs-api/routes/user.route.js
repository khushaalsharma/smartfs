import express, {request, response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

//managers
import userManager from "../managers/userManager.js";


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


router.post("/newUser", async(req, res) => {
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    const {firebaseId} = req.body;
    try{
        const user = new userManager();

        let result = await user.createNewUser(firebaseId);

        if(result != null){
            return res.status(200).json(result);
        }

        return res.status(400).json("error in creating user: " + result);
    }
    catch(error){
        return res.status(500).json(error);
    }
});

export default router;