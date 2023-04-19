import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentDto } from './create-assessment.dto';
import { VerificationStatus } from 'src/verification/entity/verification-status.entity';

export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {
    ids?: number;
    deadline?: Date;
    status?: number;
    userId?: number;
    comment?: string;
    verificationStatus?: VerificationStatus;
    editedOn?: Date
}
