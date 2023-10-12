import { Sector } from "src/master-data/sector/entity/sector.entity";
import { InvestorTool } from "../entities/investor-tool.entity";
import { ImpactCovered } from "../entities/impact-covered.entity";
import { InvestorAssessment } from "../entities/investor-assessment.entity";

export class CreateInvestorToolDto {
    investortool: InvestorTool;
    sectors: Sector[];
    impacts: ImpactCovered[];
    assess: InvestorAssessment;
    geographicalAreas: GeographicalAreasCoveredDto[]
}

export class GeographicalAreasCoveredDto {
    id: number
    name: string
    code: string
}