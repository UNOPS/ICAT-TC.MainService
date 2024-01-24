
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({nullable: true})
  selectedScore: string

  @ManyToOne((type) => CMAssessmentQuestion, {eager: true})
  @JoinColumn()
  assessment_question: CMAssessmentQuestion
  
  @ManyToOne((type) => CMAnswer, {nullable:true})
  @JoinColumn()
  answer: CMAnswer

  @ManyToOne((type) => Institution, {nullable: true, eager: true})
  @JoinColumn()
  institution: Institution
}
