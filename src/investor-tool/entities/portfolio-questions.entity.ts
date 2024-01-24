
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";

@Entity()
export class PortfolioQuestions extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @ManyToOne((type) => Characteristics, { cascade: false,eager:true })
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

    @Column({type: 'longtext', nullable: true })
    description: string;

    @Column({type: 'longtext', nullable: true })
    hint: string;

}
