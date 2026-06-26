"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path = require("path");
const constants_1 = require("../constants");
const image_mime_util_1 = require("../utils/image-mime.util");
const image_processing_service_1 = require("./image-processing.service");
let FileStorageService = FileStorageService_1 = class FileStorageService {
    constructor(config, imageProcessing) {
        this.config = config;
        this.imageProcessing = imageProcessing;
        this.logger = new common_1.Logger(FileStorageService_1.name);
    }
    async onModuleInit() {
        this.uploadDir = path.resolve(process.cwd(), this.config.get('upload.dir') ?? './uploads');
        await (0, promises_1.mkdir)(this.uploadDir, { recursive: true });
    }
    getPublicUrl(filename) {
        return `${constants_1.UPLOAD_PUBLIC_PREFIX}/${filename}`;
    }
    isLocalUploadUrl(url) {
        return typeof url === 'string' && url.startsWith(`${constants_1.UPLOAD_PUBLIC_PREFIX}/`);
    }
    resolveLocalPath(url) {
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
    getThumbnailFilename(mainFilename) {
        if (!mainFilename.endsWith('.webp') || mainFilename.includes(constants_1.THUMBNAIL_FILENAME_SUFFIX)) {
            return null;
        }
        return mainFilename.replace(/\.webp$/, `${constants_1.THUMBNAIL_FILENAME_SUFFIX}.webp`);
    }
    async saveValidatedImage(buffer) {
        const mime = (0, image_mime_util_1.detectImageMimeFromBuffer)(buffer);
        if (!mime) {
            throw new Error('INVALID_IMAGE_TYPE');
        }
        const processed = await this.imageProcessing.process(buffer);
        const filename = `${(0, crypto_1.randomUUID)()}${processed.extension}`;
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
            (0, promises_1.writeFile)(filePath, processed.mainBuffer),
            (0, promises_1.writeFile)(thumbPath, processed.thumbnailBuffer),
        ]);
        return this.getPublicUrl(filename);
    }
    async deleteIfLocal(url) {
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
        await Promise.all(filesToDelete.map(async (targetPath) => {
            try {
                await (0, promises_1.unlink)(targetPath);
            }
            catch (error) {
                this.logger.warn(`Impossible de supprimer le fichier ${targetPath}: ${String(error)}`);
            }
        }));
    }
    async deleteManyIfLocal(urls) {
        await Promise.all(urls.map((url) => this.deleteIfLocal(url)));
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = FileStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        image_processing_service_1.ImageProcessingService])
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map