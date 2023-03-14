
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Category } from "./category.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";

@Entity()
export class Indicators {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;

  
}