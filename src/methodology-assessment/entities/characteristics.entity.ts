
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Category } from "./category.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";

@Entity()
export class Characteristics {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;

    @Column()
    code: string;

    @Column({nullable: true, length: 3000})
    description: string

    @Column({nullable: true, length: 3000})
    main_question: string

    @ManyToOne((type) => Category, { cascade: false})
    @JoinColumn({ name: 'category_id' })
    category?: Category;

  
}
