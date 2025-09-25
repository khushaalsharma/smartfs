import File from "../models/file.model.js";
import { sql, config } from "../utils/config.sql.js";
import fs from "fs/promises";

export const addFileObject = async(fileName, location, size, folder, extension, author) => {
    try{
        const query = `INSERT INTO dbo.fileData(file_name, extension, file_loc, folder_id, file_size, author)
                                    VALUES ('${fileName}', '${extension}', '${location}', ${folder === 'null' ? null : folder}, ${size}, '${author}');`;
        const fetchId = "SELECT COUNT(file_id) FROM dbo.FileData;";
        const pool = await sql.connect(config);
        let result = await pool.request().query(query);
        console.log(result);
        result = await pool.request().query(fetchId);

        return result.recordset;
    }
    catch(err){
        console.log(err);
        throw new Error;
    }
}

export const getFileMetaData = () => {

} 

export const getFileContent = async(path, mimetype) => {
    const buffer = await fs.readFile(path);
    if (mimetype === "text/plain") {
        return buffer.toString("utf8");
    }
    if (mimetype === "application/json") {
        return JSON.stringify(JSON.parse(buffer.toString("utf8")), null, 2);
    }
    
    throw new Error("Unsupported file type: " + file.mimetype);
}

export const updateFilePath = async(fileId, path) => {
    try{
        const query = `UPDATE smartfs.dbo.fileData SET file_loc = '${path}' WHERE file_id = ${fileId};`;
        const pool = await sql.connect(config);
        const result = await pool.request()
                                 .query(query);
        console.log(result);
    }catch(error){
        throw new Error("couldn't update file path");
    }
}