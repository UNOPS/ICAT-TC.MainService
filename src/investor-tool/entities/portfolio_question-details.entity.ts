
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Institution } from "src/institution/entity/institution.entity";
import { InvestorAssessment } from "./investor-assessment.entity";
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
