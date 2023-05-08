import { Sector } from "src/master-data/sector/entity/sector.entity";
import { InvestorTool } from "../entities/investor-tool.entity";
import { ImpactCovered } from "../entities/impact-covered.entity";

export class CreateInvestorToolDto {
    investortool:InvestorTool;
    sectors:Sector[];
    impacts:ImpactCovered[];
}
