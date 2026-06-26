import { FileStorageService } from '../../common/storage/file-storage.service';
export declare class UploadService {
    private readonly fileStorage;
    constructor(fileStorage: FileStorageService);
    uploadImage(file?: Express.Multer.File): Promise<{
        url: string;
    }>;
}
