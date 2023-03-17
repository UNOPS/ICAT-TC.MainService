import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { User } from 'src/users/user.entity';
import { TokenDetails } from 'src/utills/token_details';
import { QualityCheckController } from './quality-check.controller';
import { QualityCheckService } from './quality-check.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParameterRequest, User]),
    ParameterHistoryModule,
    Assessment,
  ],
  controllers: [QualityCheckController],
  providers: [QualityCheckService, TokenDetails,User],
  exports: [QualityCheckService],
})
export class QualityCheckModule {}
