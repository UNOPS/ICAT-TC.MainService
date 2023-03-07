
import { Assessment } from "src/assessment/entities/assessment.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./category.entity";
import { Characteristics } from "./characteristics.entity";
import { Methodology } from "./methodology.entity";


@Entity()
export class MethodologyAssessmentParameters {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Methodology, { cascade: false })
    @JoinColumn({ name: 'methodology_id' })
    methodology?: Methodology;

    @ManyToOne((type) => Category, { cascade: false })
    @JoinColumn({ name: 'category_id' })
    category?: Category;


    @Column({ nullable: true })
    category_score: string;

    @ManyToOne((type) => Characteristics, { cascade: false })
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

    @Column({ nullable: true })
    characteristics_score: string;

    @Column({ nullable: true })
    relevance: string;

}
