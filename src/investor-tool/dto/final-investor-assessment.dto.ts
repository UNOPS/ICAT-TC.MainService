
import { GeographicalAreasCovered } from "../entities/geographical-areas-covered.entity";
import { IndicatorDetails } from "../entities/indicator-details.entity";
import { InvestorAssessment } from "../entities/investor-assessment.entity";
import { InvestorSector } from "../entities/investor-sector.entity";
import { SdgPriority } from "../entities/sdg-priority.entity";

export class FinalInvestorAssessmentDto {
    type: string;
    CategoryName: string;
    categoryID: number;
    data: InvestorAssessment[]
    
}

export class ToolsMultiselectDto{
    sectors: InvestorSector[]
    geographicalAreas: GeographicalAreasCovered[]
}

export class SdgPriorityDto {
    priorities: SdgPriority[]
}
