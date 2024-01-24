
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvestorAssessment } from "./investor-assessment.entity";
import { InvestorQuestions } from "./investor-questions.entity";

@Entity()
export class IndicatorDetails extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    type: string;

    @ManyToOne((type) => InvestorQuestions, { cascade: false ,nullable:true})
    @JoinColumn({ name: 'investorQuestions_id' })
    question: InvestorQuestions;
    
    @Column({ nullable: true })
    value: string;
    

     @ManyToOne(() => InvestorAssessment, (investorAssessment) => investorAssessment.indicator_details)
    @JoinColumn({ name: 'investorAssessment_id' })
    investorAssessment?: InvestorAssessment; 

    @Column({ nullable: true, length: 3000})
    justification: string;

}
