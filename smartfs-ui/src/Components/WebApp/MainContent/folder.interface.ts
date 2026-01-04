export interface folderProps{
    folderId: number;
    folderName: string;
    parentId: string | null;
    folderOwner: string;
    size: number | 0;
    createdAt: string;
    updatedAt: string;
}