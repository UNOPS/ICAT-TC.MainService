import { ClimateAction } from "src/climate-action/entity/climate-action.entity";


export class CreateReportDto {
    assessmentId: number;
    reportName: string = 'reportPDF.pdf';
    climateAction: ClimateAction
    reportTitle:string="Report Title"
}


export class CreateComparisonReportDto {
    portfolioId: number;
    climateAction: ClimateAction;
    reportName: string = 'reportPDF.pdf';
    reportTitle:string="Report Title";
}
