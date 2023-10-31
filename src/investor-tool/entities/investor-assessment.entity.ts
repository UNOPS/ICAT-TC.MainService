
import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { InvestorQuestions } from "./investor-questions.entity";
import { IndicatorDetails } from "./indicator-details.entity";
import { Institution } from "src/institution/entity/institution.entity";
import { PortfolioSdg } from "./portfolio-sdg.entity";
import { PortfolioQuestionDetails } from "./portfolio_question-details.entity";

@Entity()
export class InvestorAssessment extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

   

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

    @ManyToOne((type) => PortfolioSdg, { cascade: false , eager : false, nullable : true})
    @JoinColumn({ name: 'portfolioSdg_id' })
    portfolioSdg: PortfolioSdg;



    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    starting_situation: string;

    @Column({ nullable: true })
    relavance: number;

    @Column({ nullable: true })
    justification: string;

    @Column({ nullable: true })
    likelihood: number;

    @Column({ nullable: true })
    likelihood_justification: string;

    @Column({ type: 'double', nullable: true })
    relevance_weight: number;

    @Column({ type: 'double', nullable: true })
    likelihood_weight: number;

    @Column({ nullable: true })
    score: number; // outcome- sustained GHGs


     @ManyToOne((type) => InvestorTool, { cascade: false })
    @JoinColumn({ name: 'investortool_id' })
    investorTool?: InvestorTool; 

     @OneToMany(() => IndicatorDetails, (indicatorDetails) => indicatorDetails.investorAssessment)
   
    indicator_details:IndicatorDetails[] 

    @OneToMany(() => PortfolioQuestionDetails, (portfolioQuestionDetails) => portfolioQuestionDetails.investorAssessment)
    portfolioQuestion_details:PortfolioQuestionDetails[] 

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @Column({ nullable: true })
    indicator: string;

    @Column({ type: 'double', nullable: true })
    indicatorStartingVal: number;

    @Column({ type: 'double', nullable: true })
    indicatorExpectedVal: number;

    @Column({ type: 'double', nullable: true })
    expected_ghg_mitigation: number;

    @Column({ type: 'double', nullable: true })
    expected_ghg_mitigation_year: number;

    @ManyToOne((type) => Institution, { cascade: false})
    @JoinColumn({ name: 'institution_id' })
    institution?: Institution;
    

    @Column({  nullable: true })
    institutionDescription: string;

    @Column({  nullable: true })
    parameter_value: string;
    
    @Column({  nullable: true })
    enterDataAssumption: string;

    @Column({nullable: true})
    uploadedDocumentPath: string


}
