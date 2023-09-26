import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { ClimateAction } from "../entity/climate-action.entity";

export class BarrierSelected {
   
    barrier: string;
    explanation: string;
    affectedbyIntervention: boolean;
    characteristics:Characteristics[];

}
export class AllBarriersSelected {

    allBarriers: BarrierSelected[];
    climateAction: ClimateAction;

}