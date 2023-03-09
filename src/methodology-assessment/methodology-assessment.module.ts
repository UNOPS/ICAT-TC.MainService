import { Module } from '@nestjs/common';
import { MethodologyAssessmentService } from './methodology-assessment.service';
import { MethodologyAssessmentController } from './methodology-assessment.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Characteristics } from './entities/characteristics.entity';
import { MethodologyAssessmentParameters } from './entities/methodology-assessment-parameters.entity';
import { Methodology } from './entities/methodology.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ProjectService } from 'src/climate-action/climate-action.service';
import { Assessment } from 'src/assessment/entities/assessment.entity';

@Module({
  controllers: [MethodologyAssessmentController],
  providers: [MethodologyAssessmentService, ProjectService],
  imports:[TypeOrmModule.forFeature([Methodology, Category, Characteristics, MethodologyAssessmentParameters, Assessment, ClimateAction])],
  exports:[MethodologyAssessmentService, ProjectService]
})
export class MethodologyAssessmentModule {}
