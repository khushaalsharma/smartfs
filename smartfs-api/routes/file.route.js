import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import { configDotenv } from "dotenv";

import File from "../models/file.model.js";
import { addFileObject, getFileContent, updateFilePath } from "../managers/file.manager.js";
import { storeChunks } from "../managers/qdrant.manager.js";

configDotenv();
const router = express.Router();

router.use(express.json());
router.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

// -------------------- Multer Config --------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "_");
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({ storage });


// -------------------- API Route --------------------
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { userId, parent } = req.body;

        // 1. Save metadata to DB
        const fileObject = await addFileObject(
            req.file.originalname,
            req.file.path,
            req.file.size,
            parent,
            req.file.mimetype,
            userId
        );

        // 2. Rename file with DB id
        const fs = await import("fs");
        const newPath = `uploads/${fileObject[0][""]}-${req.file.originalname}`;
        fs.renameSync(req.file.path, newPath);

        // 3. Update DB with new file path
        await updateFilePath(fileObject[0][""], newPath);

        // 4. Extract content + store in Qdrant
        const content = await getFileContent(newPath, req.file.mimetype);
        await storeChunks(fileObject[0][""], content);

        return res.status(200).json({
            message: "File uploaded successfully",
            fileId: fileObject.id,
            path: newPath
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: err.message });
    }
});

export default router;
