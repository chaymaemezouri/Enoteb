import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageProcessingService } from './image-processing.service';
export declare class FileStorageService implements OnModuleInit {
    private readonly config;
    private readonly imageProcessing;
    private readonly logger;
    private uploadDir;
    constructor(config: ConfigService, imageProcessing: ImageProcessingService);
    onModuleInit(): Promise<void>;
    getPublicUrl(filename: string): string;
    isLocalUploadUrl(url: string | null | undefined): boolean;
    resolveLocalPath(url: string): string | null;
    private getThumbnailFilename;
    saveValidatedImage(buffer: Buffer): Promise<string>;
    deleteIfLocal(url: string | null | undefined): Promise<void>;
    deleteManyIfLocal(urls: Array<string | null | undefined>): Promise<void>;
}
