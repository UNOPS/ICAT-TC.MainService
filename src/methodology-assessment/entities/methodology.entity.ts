import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Methodology {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    methodology_name : string;

 
}
