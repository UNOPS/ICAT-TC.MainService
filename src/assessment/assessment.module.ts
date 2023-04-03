import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TokenDetails } from 'src/utills/token_details';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from './entities/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment])],
  controllers: [AssessmentController],
  providers: [AssessmentService,TokenDetails]
})
export class AssessmentModule {}
