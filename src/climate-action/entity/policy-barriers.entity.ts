import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Barriers } from "src/methodology-assessment/entities/barriers.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BarrierCategory } from "./barrier-category.entity";

@Entity({ name: 'policy-barriers' })
export class PolicyBarriers extends BaseTrackingEntity {

 /*    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      } */

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClimateAction, { cascade: false, eager: true, })
    climateAction: ClimateAction;

    @Column({ length: 500, default: null, nullable: true })
    barrier: string;
    @Column({ length: 500, default: null, nullable: true })
    explanation: string;

    @Column({ nullable: true})
    is_affected : boolean;

    @OneToMany(() => BarrierCategory,(barrierCategory) => barrierCategory.barriers)
    barrierCategory: BarrierCategory[];

}