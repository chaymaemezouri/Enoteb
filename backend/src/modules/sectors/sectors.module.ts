import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';

@Module({
  imports: [AuthModule],
  controllers: [SectorsController],
  providers: [SectorsService],
  exports: [SectorsService],
})
export class SectorsModule {}
