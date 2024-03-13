import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Criteria } from './criteria.entity';
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

  @Column({ type: "varchar", default: '' })
  related_questions: string

  @Column({type: 'varchar', length: 1000, default: ''})
  description: string

  @ManyToOne((type) => Criteria, { eager: true })
  @JoinColumn()
  criteria: Criteria; 

  @ManyToOne((type) => Characteristics, { eager: true })
  @JoinColumn()
  characteristic: Characteristics


}
