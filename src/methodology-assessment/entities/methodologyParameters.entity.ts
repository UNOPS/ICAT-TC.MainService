import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MethodologyIndicators } from "./methodologyindicators.entity";

@Entity()
export class MethodologyParameters extends BaseTrackingEntity {
  

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name : string;

  @Column({ nullable: true })
  value : number;

  @Column({ nullable: true })
  unit : string;


  @ManyToOne((type) => MethodologyIndicators, { cascade: false })
  @JoinColumn({ name: 'meth_id' })
  methodology ?: MethodologyIndicators;


}
