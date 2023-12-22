import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Barriers } from "src/methodology-assessment/entities/barriers.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BarrierCategory } from "./barrier-category.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { ApiHideProperty } from "@nestjs/swagger";

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

  @Column({ length: 150, type: 'varchar', default: null, nullable: true })
  barrier: string;
  @Column({ type: 'varchar', length: 1500, nullable: true })
  explanation: string;

  @Column({ nullable: true })
  is_affected: boolean;

  @OneToMany(() => BarrierCategory, (barrierCategory) => barrierCategory.barriers ,{cascade: false,
    nullable: true,
    eager: true,})
  barrierCategory: BarrierCategory[];

  @ManyToOne(() => Assessment, { cascade: false, eager: true, })
  assessment: Assessment;

  @ApiHideProperty()
  barrier_catogory: BarrierCategory[];

}