import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CalcParameters extends BaseTrackingEntity {
  

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name : string;

  

  
}