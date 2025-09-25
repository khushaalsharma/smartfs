// Folder.js
class Folder {
  constructor({
    folder_id = null,
    folder_name,
    parent_folder_id = null,
    user_id,
    createdAt = new Date(),
    updatedAt = null,
  }) {
    this.folder_id = folder_id;
    this.folder_name = folder_name;
    this.parent_folder_id = parent_folder_id;
    this.user_id = user_id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Example method to rename folder
  rename(newName) {
    this.folder_name = newName;
    this.updatedAt = new Date();
  }
}

export default Folder;
