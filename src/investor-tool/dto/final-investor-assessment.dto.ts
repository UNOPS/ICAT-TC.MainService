
import { IndicatorDetails } from "../entities/indicator-details.entity";
import { InvestorAssessment } from "../entities/investor-assessment.entity";
import { InvestorSector } from "../entities/investor-sector.entity";

export class FinalInvestorAssessmentDto {
    type: string;
    CategoryName: string;
    categoryID: number;
    data: InvestorAssessment[]
    
}

export class SectorsCoverdDto{
    sectors: InvestorSector[]
}
