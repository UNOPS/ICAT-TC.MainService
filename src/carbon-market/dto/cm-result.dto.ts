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
    selectedScore: scoreDto
    filePath: string
    isGHG: boolean
    isSDG: boolean
    isAdaptation: boolean
    relevance: string
    adaptationCoBenifit: string
}

export class SaveCMResultDto {
    result: CMResultDto[]
    assessment: Assessment
}

export class CalculateDto {
    assessmentId: number
}

export class scoreDto {
    name: string
    code: string
    value: number
}

export class UniqueCategories{
    process: UniqueCategory[]
    outcome: UniqueCategory[]
}

export class UniqueCategory{
    name: string
    code: string
    description: string
    characteristics: UniqueCharacteristic[]
}

export class UniqueCharacteristic{
    name: string
    code: string
    description: string
    main_question: string
    id: number
    questions: CMQuestion[] = []
}

export class CMScoreDto {
    process_score: number
    outcome_score: OutcomeScoreDto
    message: string
}

export class OutcomeScoreDto {
    ghg_score: number
    sdg_score: number
    adaptation_score: number
    outcome_score: number
    scale_ghg_score: number
    sustained_ghg_score: number
    scale_sdg_score: number
    sustained_sdg_score: number
    scale_adaptation_score: number
    sustained_adaptation_score: number
}