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
var ImageProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const constants_1 = require("../constants");
const image_mime_util_1 = require("../utils/image-mime.util");
const sharp_util_1 = require("../utils/sharp.util");
let ImageProcessingService = ImageProcessingService_1 = class ImageProcessingService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(ImageProcessingService_1.name);
        this.maxWidth = this.config.get('upload.imageMaxWidth') ?? 1920;
        this.maxHeight = this.config.get('upload.imageMaxHeight') ?? 1920;
        this.thumbnailWidth = this.config.get('upload.thumbnailWidth') ?? 640;
        this.quality = this.config.get('upload.imageQuality') ?? 82;
    }
    async process(buffer) {
        const mime = (0, image_mime_util_1.detectImageMimeFromBuffer)(buffer);
        if (!mime) {
            throw new Error('INVALID_IMAGE_TYPE');
        }
        try {
            const sharp = (0, sharp_util_1.loadSharp)();
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
                extension: constants_1.IMAGE_MIME_EXTENSIONS['image/webp'],
            };
        }
        catch (error) {
            this.logger.warn(`Échec du traitement image: ${String(error)}`);
            throw new Error('IMAGE_PROCESSING_FAILED');
        }
    }
};
exports.ImageProcessingService = ImageProcessingService;
exports.ImageProcessingService = ImageProcessingService = ImageProcessingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImageProcessingService);
//# sourceMappingURL=image-processing.service.js.map