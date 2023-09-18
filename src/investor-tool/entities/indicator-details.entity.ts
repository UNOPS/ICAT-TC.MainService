import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Institution } from "src/institution/entity/institution.entity";
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
    
    // @ManyToOne((type) => Institution, { cascade: false,nullable:true })
    // @JoinColumn({ name: 'institution_id' })
    // institution: Institution;


    @Column({ nullable: true })
    value: string;
    

     @ManyToOne(() => InvestorAssessment, (investorAssessment) => investorAssessment.indicator_details)
    @JoinColumn({ name: 'investorAssessment_id' })
    investorAssessment?: InvestorAssessment; 

    @Column({ nullable: true, length: 3000})
    justification: string;

    // @ManyToOne((type) => InvestorTool, { cascade: false })
    // @JoinColumn({ name: 'investorTool_id' })
    // investorTool?: InvestorTool;

    


}
