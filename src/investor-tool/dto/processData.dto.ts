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

export class ProcessData2 {
    CategoryName:string;
    categoryID:number;
    data:InvestorAssessment[];
    type: string;
    index : number;
}