import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Institution } from "src/institution/entity/institution.entity";
import { InvestorAssessment } from "./investor-assessment.entity";
import { InvestorQuestions } from "./investor-questions.entity";
import { PortfolioQuestions } from "./portfolio-questions.entity";

@Entity()
export class PortfolioQuestionDetails extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    type: string;

    @ManyToOne((type) => PortfolioQuestions, { cascade: false })
    @JoinColumn({ name: 'portfolioQuestions_id' })
    question: PortfolioQuestions;
    
    @ManyToOne((type) => Institution, { cascade: false })
    @JoinColumn({ name: 'institution_id' })
    institution: Institution;


    @Column({ nullable: true })
    value: string;
    

     @ManyToOne(() => InvestorAssessment, (investorAssessment) => investorAssessment.portfolioQuestion_details)
    @JoinColumn({ name: 'investorAssessment_id' })
    investorAssessment?: InvestorAssessment; 

}
