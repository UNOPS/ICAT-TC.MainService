import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Section } from './section.entity';
import { Criteria } from './criteria.entity';
import { CMAnswer } from './cm-answer.entity';


@Entity()
export class CMQuestion extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer_type: string;

  @Column()
  code: string

  @Column()
  order: number

  @ManyToOne((type) => CMQuestion, { eager: false}) // dont change eager = false
  @JoinColumn()
  pre_question: CMQuestion; 
  
  @ManyToOne((type) => CMAnswer, { eager: true}) 
  @JoinColumn()
  prev_answer_to_generate: CMAnswer; 

  @ManyToOne((type) => Section, { eager: true}) 
  @JoinColumn()
  section: Section; 

  @ManyToOne((type) => Criteria, { eager: true}) 
  @JoinColumn()
  criteria: Criteria; 
}
