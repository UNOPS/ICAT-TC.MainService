
import { GeographicalAreasCovered } from "../entities/geographical-areas-covered.entity";
import { InvestorAssessment } from "../entities/investor-assessment.entity";
import { InvestorSector } from "../entities/investor-sector.entity";
import { SdgPriority } from "../entities/sdg-priority.entity";
import { TotalInvestment } from "../entities/total-investment.entity";

export class FinalInvestorAssessmentDto {
    type: string;
    CategoryName: string;
    categoryID: number;
    isDraft: boolean
    isEdit: boolean
    data: InvestorAssessment[]
    
}

export class ToolsMultiselectDto{
    sectors: InvestorSector[]
    geographicalAreas: GeographicalAreasCovered[]
    assessmentId?: number
    isCompleted?: boolean
}

export class SdgPriorityDto {
    priorities: SdgPriority[]
}

export class TotalInvestmentDto {
    totalInvestements: TotalInvestment[]
}
