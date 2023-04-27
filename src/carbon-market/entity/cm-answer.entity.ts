import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CMQuestion } from './cm-question.entity';


@Entity()
export class CMAnswer extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({default: 0})
  weight: number

  @Column({default: 100})
  score_portion: number

  @Column({default: true})
  isPassing: boolean

  @ManyToOne((type) => CMQuestion, { eager: true}) 
  @JoinColumn()
  question: CMQuestion; 

}
