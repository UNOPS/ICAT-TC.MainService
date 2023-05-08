import { Sector } from "src/master-data/sector/entity/sector.entity";
import { InvestorTool } from "../entities/investor-tool.entity";
import { ImpactCovered } from "../entities/impact-covered.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { InvestorAssessment } from "../entities/investor-assessment.entity";

export class InvestorAssessmentDto {
    tool:string;
    chategories:Category;
    characteristic:Characteristics;
    data:InvestorAssessment;
    dataa:{
        
    }
    
}
