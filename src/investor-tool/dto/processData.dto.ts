import { InvestorAssessment } from "../entities/investor-assessment.entity";

export class ProcessData {
    CategoryName:string;
    categoryID:number;
    data:InvestorAssessment[];
    type: string;
}
export class ProcessDataDto {
    processData:ProcessData[]
}