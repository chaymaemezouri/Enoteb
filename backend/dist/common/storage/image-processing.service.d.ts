import { ConfigService } from '@nestjs/config';
import { AllowedImageMime } from '../constants';
export interface ProcessedImage {
    mainBuffer: Buffer;
    thumbnailBuffer: Buffer;
    mime: AllowedImageMime;
    extension: string;
}
export declare class ImageProcessingService {
    private readonly config;
    private readonly logger;
    private readonly maxWidth;
    private readonly maxHeight;
    private readonly thumbnailWidth;
    private readonly quality;
    constructor(config: ConfigService);
    process(buffer: Buffer): Promise<ProcessedImage>;
}
