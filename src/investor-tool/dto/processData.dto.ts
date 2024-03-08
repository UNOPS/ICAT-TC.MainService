import { InvestorAssessment } from "../entities/investor-assessment.entity";

export class ProcessData {
    CategoryName:string;
    categoryID:number;
    categoryCode: string;
    data:InvestorAssessment[];
    type: string;
    id:number
}
export class ProcessDataDto {
    processData:ProcessData[]
}

export class ProcessData2 {
    CategoryName:string;
    categoryID:number;
    categoryCode: string;
    data:InvestorAssessment[];
    type: string;
    index : number;
}