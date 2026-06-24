import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import * as path from 'path';
import {
  THUMBNAIL_FILENAME_SUFFIX,
  UPLOAD_PUBLIC_PREFIX,
} from '../constants';
import { detectImageMimeFromBuffer } from '../utils/image-mime.util';
import { ImageProcessingService } from './image-processing.service';

@Injectable()
export class FileStorageService implements OnModuleInit {
  private readonly logger = new Logger(FileStorageService.name);
  private uploadDir!: string;

  constructor(
    private readonly config: ConfigService,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.uploadDir = path.resolve(
      process.cwd(),
      this.config.get<string>('upload.dir') ?? './uploads',
    );
    await mkdir(this.uploadDir, { recursive: true });
  }

  getPublicUrl(filename: string): string {
    return `${UPLOAD_PUBLIC_PREFIX}/${filename}`;
  }

  isLocalUploadUrl(url: string | null | undefined): boolean {
    return typeof url === 'string' && url.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`);
  }

  resolveLocalPath(url: string): string | null {
    if (!this.isLocalUploadUrl(url)) {
      return null;
    }

    const filename = path.basename(url);
    const resolved = path.resolve(this.uploadDir, filename);

    if (!resolved.startsWith(this.uploadDir + path.sep)) {
      return null;
    }

    return resolved;
  }

  private getThumbnailFilename(mainFilename: string): string | null {
    if (!mainFilename.endsWith('.webp') || mainFilename.includes(THUMBNAIL_FILENAME_SUFFIX)) {
      return null;
    }

    return mainFilename.replace(/\.webp$/, `${THUMBNAIL_FILENAME_SUFFIX}.webp`);
  }

  async saveValidatedImage(buffer: Buffer): Promise<string> {
    const mime = detectImageMimeFromBuffer(buffer);

    if (!mime) {
      throw new Error('INVALID_IMAGE_TYPE');
    }

    const processed = await this.imageProcessing.process(buffer);
    const filename = `${randomUUID()}${processed.extension}`;
    const filePath = path.resolve(this.uploadDir, filename);

    if (!filePath.startsWith(this.uploadDir + path.sep)) {
      throw new Error('INVALID_FILE_PATH');
    }

    const thumbFilename = this.getThumbnailFilename(filename);

    if (!thumbFilename) {
      throw new Error('INVALID_FILE_PATH');
    }

    const thumbPath = path.resolve(this.uploadDir, thumbFilename);

    await Promise.all([
      writeFile(filePath, processed.mainBuffer),
      writeFile(thumbPath, processed.thumbnailBuffer),
    ]);

    return this.getPublicUrl(filename);
  }

  async deleteIfLocal(url: string | null | undefined): Promise<void> {
    if (!url) {
      return;
    }

    const filePath = this.resolveLocalPath(url);

    if (!filePath) {
      return;
    }

    const filesToDelete = [filePath];
    const thumbFilename = this.getThumbnailFilename(path.basename(filePath));

    if (thumbFilename) {
      filesToDelete.push(path.resolve(this.uploadDir, thumbFilename));
    }

    await Promise.all(
      filesToDelete.map(async (targetPath) => {
        try {
          await unlink(targetPath);
        } catch (error) {
          this.logger.warn(
            `Impossible de supprimer le fichier ${targetPath}: ${String(error)}`,
          );
        }
      }),
    );
  }

  async deleteManyIfLocal(urls: Array<string | null | undefined>): Promise<void> {
    await Promise.all(urls.map((url) => this.deleteIfLocal(url)));
  }
}
