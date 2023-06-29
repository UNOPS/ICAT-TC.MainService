import { Assessment } from 'src/assessment/entities/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CMQuestion } from './cm-question.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';


@Entity()
export class CMAssessmentQuestion extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  comment: string

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  assessment: Assessment

  @Column({ nullable: true })
  enterDataAssumption: string;

  @Column({nullable: true})
  sdgIndicator: string

  @Column({nullable: true})
  startingSituation: string

  @Column({nullable: true})
  expectedImpact: string

  @Column({nullable: true})
  selectedSdg: string

  @Column({nullable: true})
  uploadedDocumentPath: string

  @ManyToOne((type) => Characteristics, {nullable: true})
  @JoinColumn()
  characteristic: Characteristics

  @ManyToOne((type) => CMQuestion, { nullable: true })
  @JoinColumn()
  question: CMQuestion



}
