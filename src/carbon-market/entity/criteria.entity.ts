import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Section } from './section.entity';


@Entity()
export class Criteria extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string

  @Column()
  order: number

  @ManyToOne((type) => Criteria, { eager: true}) 
  @JoinColumn()
  section: Section; 

}
