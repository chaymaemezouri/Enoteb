import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Protège les endpoints d'écriture admin (POST/PATCH/DELETE).
 * À appliquer sur les controllers projects et sectors en Phase 3.
 */
export function AdminWriteProtected() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
