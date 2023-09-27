import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true, length: 3000 })
  description: string;


  @Column({default: 0})
  cm_weight: number

  @Column({default: 0})
  ip_weight: number


  /*     @ManyToOne(type => Methodology, methodology => methodology.categories)
      @JoinColumn({ name: 'methodology_id' })
      methodology: Methodology; */

  @ManyToOne((type) => Methodology, { cascade: false })
  @JoinColumn({ name: 'methodology_id' })
  methodology?: Methodology;

}

