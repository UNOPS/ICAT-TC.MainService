import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MethodologyIndicators } from "./methodologyindicators.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Characteristics } from "./characteristics.entity";
import { MethodologyParameters } from "./methodologyParameters.entity";

@Entity()
export class CalculationResults extends BaseTrackingEntity {


  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => MethodologyParameters, { cascade: false })
  @JoinColumn({ name: 'parameter_id' })
  parameter?: MethodologyParameters;

  @Column({type: "double",nullable: true })
  value: number;

  @Column({ type: "double", nullable: true })
  result: number;

  @ManyToOne((type) => Assessment, { cascade: false })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne((type) => Characteristics, { cascade: false })
  @JoinColumn({ name: 'characteristics_id' })
  characteristics?: Characteristics;

  @ManyToOne((type) => MethodologyIndicators, { cascade: false })
  @JoinColumn({ name: 'meth_id' })
  methodology?: MethodologyIndicators;




}
