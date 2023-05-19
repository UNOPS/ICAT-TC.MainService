import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Barriers } from "src/methodology-assessment/entities/barriers.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'policy-barriers' })
export class PolicyBarriers extends BaseTrackingEntity {

 /*    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      } */

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClimateAction, climateAction => climateAction.policyBarriers)
    climateAction: ClimateAction;

    @ManyToOne(() => Barriers, barriers => barriers.policyBarriers, { nullable: true})
    barriers: Barriers;

    @ManyToOne((type) => Characteristics, { cascade: false ,eager:true,nullable: true})
    @JoinColumn({ name: 'characteristics_id' })
    characteristics: Characteristics;

    @Column({ nullable: true})
    is_affected : boolean;

}