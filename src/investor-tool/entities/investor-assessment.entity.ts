
import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";

@Entity()
export class InvestorAssessment extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    type: string;

    // @Column({ nullable: true })
    // Category: string;

    @ManyToOne((type) => Category, { cascade: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne((type) => Characteristics, { cascade: false })
    @JoinColumn({ name: 'characteristic_id' })
    characteristics: Characteristics;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    starting_situation: string;

    @Column({ nullable: true })
    relavance: number;

    @Column({ nullable: true })
    justification: string;

    @Column({ nullable: true })
    question01: string; // does the project have a local R&D

    @Column({ nullable: true })
    question02: string; // does the project have a significant training component

    @Column({ nullable: true })
    question03: string; //is the project first of its kind for the local project developer

    @Column({ nullable: true })
    question04: string; //is the project first of its kind for the local project developer

   

    @Column({ nullable: true })
    likelihood: number;

    @Column({ nullable: true })
    likelihood_justification: string;

    @Column({ nullable: true })
    relevance_weight: number;

    @Column({ nullable: true })
    likelihood_weight: number;

    @Column({ nullable: true })
    score: number; // outcome- sustained GHGs


    @ManyToOne((type) => InvestorTool, { cascade: false })
    @JoinColumn({ name: 'investortool_id' })
    investorTool?: InvestorTool;

    

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @Column({ nullable: true })
    indicator: string;


}
