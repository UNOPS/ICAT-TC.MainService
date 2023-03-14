import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class BarriersCategory {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    category : string;
}

