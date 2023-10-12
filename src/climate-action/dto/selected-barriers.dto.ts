import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { ClimateAction } from "../entity/climate-action.entity";
import { PolicySector } from "../entity/policy-sectors.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";

export class BarrierSelected {
   
    barrier: string;
    explanation: string;
    affectedbyIntervention: boolean;
    characteristics:Characteristics[];

}
export class AllBarriersSelected {

    allBarriers: BarrierSelected[];
    climateAction: ClimateAction;
    assessment:Assessment;

}
export class AllPolicySectors {

    allSectors: PolicySector[];

}