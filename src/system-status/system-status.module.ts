import { Module } from '@nestjs/common';
import { SystemStatusService } from './system-status.service';
import { SystemStatusController } from './system-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemStatus } from './entities/system-status.entity';

@Module({imports: [TypeOrmModule.forFeature([
 SystemStatus
  
])],
  controllers: [SystemStatusController],
  providers: [SystemStatusService]
})
export class SystemStatusModule {}
