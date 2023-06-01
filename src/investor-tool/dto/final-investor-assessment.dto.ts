
import { IndicatorDetails } from "../entities/indicator-details.entity";
import { InvestorAssessment } from "../entities/investor-assessment.entity";

export class FinalInvestorAssessmentDto {
    type: string;
    CategoryName: string;
    categoryID: number;
    data: InvestorAssessment[]
    
}
