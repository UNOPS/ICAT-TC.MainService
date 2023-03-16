
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Category } from "./category.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";
import { Indicators } from "./indicators.entity";

@Entity()
export class MethodologyIndicators {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;

    @ManyToOne((type) => Indicators, { cascade: false })
    @JoinColumn({ name: 'indicator_id' })
    indicator ?: Indicators;
  
}