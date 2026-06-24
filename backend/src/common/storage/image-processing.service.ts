import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { AllowedImageMime, IMAGE_MIME_EXTENSIONS } from '../constants';
import { detectImageMimeFromBuffer } from '../utils/image-mime.util';

export interface ProcessedImage {
  mainBuffer: Buffer;
  thumbnailBuffer: Buffer;
  mime: AllowedImageMime;
  extension: string;
}

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);
  private readonly maxWidth: number;
  private readonly maxHeight: number;
  private readonly thumbnailWidth: number;
  private readonly quality: number;

  constructor(private readonly config: ConfigService) {
    this.maxWidth = this.config.get<number>('upload.imageMaxWidth') ?? 1920;
    this.maxHeight = this.config.get<number>('upload.imageMaxHeight') ?? 1920;
    this.thumbnailWidth = this.config.get<number>('upload.thumbnailWidth') ?? 640;
    this.quality = this.config.get<number>('upload.imageQuality') ?? 82;
  }

  async process(buffer: Buffer): Promise<ProcessedImage> {
    const mime = detectImageMimeFromBuffer(buffer);

    if (!mime) {
      throw new Error('INVALID_IMAGE_TYPE');
    }

    try {
      const pipeline = sharp(buffer, { failOn: 'none' }).rotate();

      const mainBuffer = await pipeline
        .clone()
        .resize({
          width: this.maxWidth,
          height: this.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: this.quality })
        .toBuffer();

      const thumbnailBuffer = await sharp(buffer, { failOn: 'none' })
        .rotate()
        .resize({
          width: this.thumbnailWidth,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: Math.max(this.quality - 8, 70) })
        .toBuffer();

      return {
        mainBuffer,
        thumbnailBuffer,
        mime: 'image/webp',
        extension: IMAGE_MIME_EXTENSIONS['image/webp'],
      };
    } catch (error) {
      this.logger.warn(`Échec du traitement image: ${String(error)}`);
      throw new Error('IMAGE_PROCESSING_FAILED');
    }
  }
}
