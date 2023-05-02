import { ClimateAction } from "src/climate-action/entity/climate-action.entity";


export class CreateReportDto {
    assessmentId: number;
    reportName: string;
    climateAction: ClimateAction
    reportTitle:string="Report Title"
}
