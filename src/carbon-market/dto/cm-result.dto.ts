import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { CMQuestion } from "../entity/cm-question.entity";

export class CMResultDto {
    question: CMQuestion
    answer: CMAnswer | CMAnswer[]
    comment: string
}

export class SaveCMResultDto {
    result: CMResultDto[]
    assessment: Assessment
}