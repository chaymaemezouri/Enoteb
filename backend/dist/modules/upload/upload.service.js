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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../common/constants");
const file_storage_service_1 = require("../../common/storage/file-storage.service");
let UploadService = class UploadService {
    constructor(fileStorage) {
        this.fileStorage = fileStorage;
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        if (file.size > constants_1.MAX_IMAGE_SIZE_BYTES) {
            const maxMb = Math.round(constants_1.MAX_IMAGE_SIZE_BYTES / (1024 * 1024));
            throw new common_1.PayloadTooLargeException(`Le fichier dépasse la taille maximale de ${maxMb} Mo`);
        }
        try {
            const url = await this.fileStorage.saveValidatedImage(file.buffer);
            return { url };
        }
        catch {
            throw new common_1.BadRequestException('Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_storage_service_1.FileStorageService])
], UploadService);
//# sourceMappingURL=upload.service.js.map