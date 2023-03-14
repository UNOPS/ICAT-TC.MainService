import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Barriers } from "src/methodology-assessment/entities/barriers.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'policy-barriers' })
export class PolicyBarriers extends BaseTrackingEntity {

    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClimateAction, climateAction => climateAction.policyBarriers)
    climateAction: ClimateAction;

    @ManyToOne(() => Barriers, barriers => barriers.policyBarriers)
    barriers: Barriers;

}