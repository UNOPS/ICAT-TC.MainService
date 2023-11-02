import { ClimateAction } from "src/climate-action/entity/climate-action.entity";


export class CreateReportDto {
    assessmentId: number;
    type:string;
    tool:string;
    reportName: string = 'reportPDF.pdf';
    climateAction: ClimateAction
    reportTitle:string="Report Title"
}


export class CreateComparisonReportDto {
    portfolioId: number;
    type:string;
    tool:string;
    climateAction: ClimateAction;
    reportName: string = 'reportPDF.pdf';
    reportTitle:string="Report Title";
}
