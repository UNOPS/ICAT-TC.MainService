import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity,ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BarrierCategory } from "./barrier-category.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { ApiHideProperty } from "@nestjs/swagger";

@Entity({ name: 'policy-barriers' })
export class PolicyBarriers extends BaseTrackingEntity {


  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClimateAction, { cascade: false, eager: true, })
  climateAction: ClimateAction;

  @Column({ length: 150, type: 'varchar', default: null, nullable: true })
  barrier: string;

  @Column({ type: 'varchar', length: 1500, nullable: true })
  explanation: string;

  @Column({ length: 150, type: 'varchar', default: null, nullable: true })
  barrier_new: string;

  @Column({ type: 'varchar', length: 1500, nullable: true })
  explanation_new: string;


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