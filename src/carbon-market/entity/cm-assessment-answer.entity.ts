
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CMAssessmentQuestion } from './cm-assessment-question.entity';
import { CMAnswer } from './cm-answer.entity';


@Entity()
export class CMAssessmentAnswer extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number

  @ManyToOne((type) => CMAssessmentQuestion)
  @JoinColumn()
  assessment_question: CMAssessmentQuestion
  
  @ManyToOne((type) => CMAnswer)
  @JoinColumn()
  answer: CMAnswer
}
