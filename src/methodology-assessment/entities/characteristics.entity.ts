
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Category } from "./category.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";

@Entity()
export class Characteristics {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column()
    code: string;

    @Column({ nullable: true, length: 3000 })
    description: string

    @Column({ nullable: true, length: 3000 })
    main_question: string

    @Column({default: 0})
    cm_weight: number

    @ManyToOne((type) => Category, { cascade: false })
    @JoinColumn({ name: 'category_id' })
    category?: Category;

    @Column({type: 'longtext', nullable: true })
    investmentDescription: string;

    @Column({default: 0})
    ip_weight: number

    @Column({type: 'longtext', nullable: true })
    portfolioDescription: string;


    @Column({type: 'longtext', nullable: true })
    portfolioHint: string;

    @Column({type: 'longtext', nullable: true })
    portfolioQuestion: string;

}
