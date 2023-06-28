import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { CMQuestion } from "../entity/cm-question.entity";
import { Institution } from "src/institution/entity/institution.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";

export class CMResultDto {
    question: CMQuestion
    answer: CMAnswer 
    institution: Institution
    comment: string
    type: string //Direct or indirect
    characteristic: Characteristics
    sdgIndicator: string
    startingSituation: string
    expectedImpact: string
    selectedSdg: string
    selectedScore: string
}

export class SaveCMResultDto {
    result: CMResultDto[]
    assessment: Assessment
}

export class CalculateDto {
    assessmentId: number
}