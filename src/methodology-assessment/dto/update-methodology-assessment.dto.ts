import { PartialType } from '@nestjs/mapped-types';
import { CreateMethodologyAssessmentDto } from './create-methodology-assessment.dto';

export class UpdateMethodologyAssessmentDto extends PartialType(CreateMethodologyAssessmentDto) {}
