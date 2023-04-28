import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CalcParameters } from "./calcParameters.entity";
import { MethodologyIndicators } from "./methodologyindicators.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Characteristics } from "./characteristics.entity";

@Entity()
export class AssessmentParameters extends BaseTrackingEntity {
  

  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Characteristics, { cascade: false })
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

  @Column({ nullable: true })
  result : number;



  @Column({ nullable: true })
  unit : string;


  @ManyToOne((type) => MethodologyIndicators, { cascade: false })
  @JoinColumn({ name: 'meth_id' })
  methodology ?: MethodologyIndicators;

  


}
