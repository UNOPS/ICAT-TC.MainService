import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PolicyBarriers } from "./policy-barriers.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";

@Entity({ name: 'barrier-category' })
export class BarrierCategory extends BaseTrackingEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClimateAction, { cascade: false, eager: true, })
    climateAction: ClimateAction;

    @ManyToOne(() => PolicyBarriers, { cascade: false })
    barriers: PolicyBarriers;

    @ManyToOne(() => Characteristics, { cascade: false, eager: true, })
    characteristics: Characteristics;

    @ManyToOne(() => Assessment, { cascade: false, eager: true, })
    assessment: Assessment;

}