import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { CMQuestion } from "../entity/cm-question.entity";
import { Institution } from "src/institution/entity/institution.entity";

export class CMResultDto {
    question: CMQuestion
    answer: CMAnswer | CMAnswer[]
    institution: Institution
    comment: string
    type: string
}

export class SaveCMResultDto {
    result: CMResultDto[]
    assessment: Assessment
}

export class CalculateDto {
    assessmentId: number
}