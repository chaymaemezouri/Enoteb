import { Global, Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { ImageProcessingService } from './image-processing.service';

@Global()
@Module({
  providers: [ImageProcessingService, FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}