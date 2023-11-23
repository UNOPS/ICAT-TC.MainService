import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Section } from './section.entity';
import { Criteria } from './criteria.entity';
import { CMAnswer } from './cm-answer.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';


@Entity()
export class CMQuestion extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer_type: string;

  @Column()
  code: string

  @Column( { type: "varchar",length: 3000 })
  label: string

  @Column()
  order: number

  @Column({ type: "varchar", length: 10000, default: '' })
  message: string

  @Column({ type: "varchar", length: 1000, default: '' })
  short_label: string

  @ManyToOne((type) => Criteria, { eager: true })
  @JoinColumn()
  criteria: Criteria; 

  @ManyToOne((type) => Characteristics, { eager: true })
  @JoinColumn()
  characteristic: Characteristics


}
