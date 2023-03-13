import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BarriersCategory } from "./barrierscategory.entity";

@Entity({ name: 'barriers' })

export class Barriers {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    barrier : string;

    @ManyToOne((type) => BarriersCategory, { cascade: false,eager:true })
    @JoinColumn({ name: 'barriersCategory_id' })
    barriersCategory?: BarriersCategory;
}


