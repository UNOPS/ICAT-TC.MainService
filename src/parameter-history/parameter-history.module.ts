import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { ParameterHistory } from './entity/parameter-history.entity';
import { ParameterHistoryController } from './parameter-history.controller';
import { ParameterHistoryService } from './parameter-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterHistory,MethodologyAssessmentParameters,  ParameterRequest])],
  controllers: [ParameterHistoryController],
  providers: [ParameterHistoryService],
  exports: [ParameterHistoryService],
})
export class ParameterHistoryModule {}
