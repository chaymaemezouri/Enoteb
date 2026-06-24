import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { MAX_IMAGE_SIZE_BYTES } from '../../common/constants';
import { FileStorageService } from '../../common/storage/file-storage.service';

@Injectable()
export class UploadService {
  constructor(private readonly fileStorage: FileStorageService) {}

  async uploadImage(file?: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new PayloadTooLargeException(
        'Le fichier dépasse la taille maximale de 5 Mo',
      );
    }

    try {
      const url = await this.fileStorage.saveValidatedImage(file.buffer);
      return { url };
    } catch {
      throw new BadRequestException(
        'Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP',
      );
    }
  }
}
