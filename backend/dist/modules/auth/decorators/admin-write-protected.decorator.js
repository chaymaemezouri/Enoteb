"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWriteProtected = AdminWriteProtected;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
function AdminWriteProtected() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard));
}
//# sourceMappingURL=admin-write-protected.decorator.js.map