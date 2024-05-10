import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { ClimateAction } from "../entity/climate-action.entity";
import { PolicySector } from "../entity/policy-sectors.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Sector } from "src/master-data/sector/entity/sector.entity";

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

export class addPolicySector {
    sector:Sector[];
    id:number;
}