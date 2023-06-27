import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Section extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string

  @Column()
  order: number

  @Column({ type: "varchar",length: 3000 })
  description: string

}
