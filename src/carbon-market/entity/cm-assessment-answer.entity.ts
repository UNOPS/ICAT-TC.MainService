
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CMAssessmentQuestion } from './cm-assessment-question.entity';
import { CMAnswer } from './cm-answer.entity';
import { Institution } from 'src/institution/entity/institution.entity';


@Entity()
export class CMAssessmentAnswer extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "double", nullable: true})
  score: number

  @Column()
  approach: string

  @ManyToOne((type) => CMAssessmentQuestion)
  @JoinColumn()
  assessment_question: CMAssessmentQuestion
  
  @ManyToOne((type) => CMAnswer)
  @JoinColumn()
  answer: CMAnswer

  @ManyToOne((type) => Institution, {nullable: true, eager: true})
  @JoinColumn()
  institution: Institution
}
