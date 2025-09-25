// File.js
class File {
  constructor({
    file_id = null,
    file_name,
    disk_file_name,
    extension,
    file_loc,
    folder_id = null,
    file_size,
    author,
  }) {
    this.file_id = file_id;
    this.file_name = file_name;
    this.disk_file_name = disk_file_name;
    this.extension = extension;
    this.file_loc = file_loc;
    this.folder_id = folder_id;
    this.file_size = file_size;
    this.author = author;
  }

  // Example method to move file to another folder
  moveToFolder(newFolderId) {
    this.folder_id = newFolderId;
  }
}

export default File;
