import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Barriers } from "src/methodology-assessment/entities/barriers.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'policy-barriers' })
export class PolicyBarriers extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClimateAction, { cascade: false })
    climateAction: ClimateAction;

    @ManyToOne(() => Barriers, { cascade: false })
    barriers: Barriers;
}