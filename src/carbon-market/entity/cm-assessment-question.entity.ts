import { Assessment } from 'src/assessment/entities/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CMQuestion } from './cm-question.entity';


@Entity()
export class CMAssessmentQuestion extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  comment: string

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  assessment: Assessment
  
  @ManyToOne((type) => CMQuestion)
  @JoinColumn()
  question: CMQuestion

  @Column({ nullable: true })
  enterDataAssumption: string;


  
}
