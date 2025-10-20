import {sql, config} from "../utils/config.sql.js";

export async function createFolder(folderName, parentId, author){
    const pool = await sql.connect(config);
    let query = `INSERT INTO dbo.folderData (folder_name, parent_folder_id, user_id) VALUES ('${folderName}', ${parentId}, '${author}')`;
    const result = await pool.request().query(query);
    query = `SELECT folder_id FROM dbo.folderData WHERE folder_name = '${folderName}' AND parent_folder_id = ${parentId} AND user_id = '${author}'`;
    const folderId = await pool.request().query(query);
    return folderId.recordset[0];
}

export async function getFolderByAuthor(authorId){
    const pool = await sql.connect(config);
    const query = `SELECT folder_id, folder_name, parent_folder_id FROM dbo.folderData WHERE user_id = '${authorId}'`;
    const folders = await pool.request().query(query);
    return folders.recordset;
}

export async function getSubFolders(parentId, authorId){
    const pool = await sql.connect(config);
    let query = '';
    if(parentId !== null && parentId !== ''){
        query = `SELECT folder_id, folder_name, parent_folder_id FROM dbo.folderData WHERE parent_folder_id = ${parentId} AND user_id = '${authorId}'`;
    }else{
        query = `SELECT folder_id, folder_name, parent_folder_id FROM dbo.folderData WHERE user_id = '${authorId}'`;
    }
    const folders = await pool.request().query(query);
    return folders.recordset;
}