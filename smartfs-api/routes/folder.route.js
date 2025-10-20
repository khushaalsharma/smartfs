import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

import { createFolder, getFolderByAuthor, getSubFolders } from "../managers/folder.manager.js";

configDotenv();
const router = express.Router();

router.use(express.json());
router.use(cors({
    origin: process.env.feLink,
    credentials: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

router.post("/create", async(req, res) => {

    try{
        const {folderName, parentId, author} = req.body;
        const folder = await createFolder(folderName, parentId, author);
        res.status(200).json(folder);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
});

router.get("/all/:authorId", async(req, res) => {
    try{
        const {authorId} = req.params;
        const folders = await getFolderByAuthor(authorId);
        res.status(200).json(folders);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
});

router.get("/subfolders/:authorId", async(req, res) => {
    try{
        const {authorId} = req.params;    
        const {parentId} = req.query;
        const folders = await getSubFolders(parentId, authorId);    
        res.status(200).json(folders);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }       
});

export default router;