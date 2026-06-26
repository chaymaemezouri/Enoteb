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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../auth");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboard() {
        return this.adminService.getDashboard();
    }
    listProjects() {
        return this.adminService.listProjects();
    }
    getProject(id) {
        return this.adminService.getProjectById(id);
    }
    listContactRequests(filter) {
        const normalized = filter === 'unread' ? 'unread' : 'all';
        return this.adminService.listContactRequests(normalized);
    }
    getContactRequest(id) {
        return this.adminService.getContactRequestById(id);
    }
    markContactRequestRead(id, value) {
        const isRead = value !== 'false';
        return this.adminService.markContactRequestRead(id, isRead);
    }
    deleteContactRequest(id) {
        return this.adminService.deleteContactRequest(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, auth_1.AdminWriteProtected)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, auth_1.AdminWriteProtected)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listProjects", null);
__decorate([
    (0, common_1.Get)('projects/:id'),
    (0, auth_1.AdminWriteProtected)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getProject", null);
__decorate([
    (0, common_1.Get)('contact-requests'),
    (0, auth_1.AdminWriteProtected)(),
    __param(0, (0, common_1.Query)('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listContactRequests", null);
__decorate([
    (0, common_1.Get)('contact-requests/:id'),
    (0, auth_1.AdminWriteProtected)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getContactRequest", null);
__decorate([
    (0, common_1.Patch)('contact-requests/:id/read'),
    (0, auth_1.AdminWriteProtected)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "markContactRequestRead", null);
__decorate([
    (0, common_1.Delete)('contact-requests/:id'),
    (0, common_1.HttpCode)(204),
    (0, auth_1.AdminWriteProtected)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteContactRequest", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map