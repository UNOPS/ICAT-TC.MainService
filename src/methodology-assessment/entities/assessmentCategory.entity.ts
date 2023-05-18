
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Barriers } from "./barriers.entity";
import { Category } from "./category.entity";

@Entity()
export class AssessmentCategory {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Category, { cascade: false })
    @JoinColumn({ name: 'category_id' })
    category?: Category;

    @Column({ type: 'double', nullable: true })
    categoryScore : number;

    @Column({ type: 'double', nullable: true })
    categoryWeight : number

}
