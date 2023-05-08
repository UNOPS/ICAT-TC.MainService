
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity'
import { Methodology } from "src/methodology-assessment/entities/methodology.entity";
import { QuAlityCheckStatus } from "src/quality-check/entity/quality-check-status.entity";
import { VerificationStatus } from "src/verification/entity/verification-status.entity";
import { User } from "src/users/entity/user.entity";
import { MethodologyAssessmentParameters } from "src/methodology-assessment/entities/methodology-assessment-parameters.entity";
import { InvestorTool } from "src/investor-tool/entities/investor-tool.entity";
@Entity()
export class Assessment extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    year: string;

    @ManyToOne((type) => ClimateAction, { cascade: false })
    @JoinColumn({ name: 'climateAction_id' })
    climateAction?: ClimateAction;

    @ManyToOne((type) => Methodology, { cascade: false })
    @JoinColumn({ name: 'methodology_id' })
    methodology?: Methodology;

    @Column({ nullable: true })
    assessmentType: string; // assessmentType :- Ex-Post, Ex-Ante

    @Column({ nullable: true })
    tool: string;

    @Column({ nullable: true })
    from: string;

    @Column({ nullable: true })
    to: string;

    @Column({ nullable: true })
    assessment_method: string; //track , track 2

    @Column({ nullable: true })
    assessment_approach: string; //direct, indirect

    @Column({ nullable: true })
    qaStatus?: QuAlityCheckStatus;

    @Column({ nullable: true })
    person: string;

    @Column({type: 'longtext', nullable: true })
    opportunities: string;
    
    @Column({ type:"mediumtext" ,nullable: true })
    audience?: string;

    @Column({ type:"mediumtext" ,nullable: true })
    assessBoundry?: string;

    @Column({ type:"mediumtext" ,nullable: true })
    impactsCovered?: string;

    @Column({ nullable: true })
    verificationStatus?: VerificationStatus;

    @Column({nullable: true})
    verificationUser?: number
    
    @Column({ nullable: true })
    qaAssighnDate?: string;

   @Column({ nullable: true })
    qaDeadline?: Date;

    @Column({ nullable: true })
    verificationDeadline?: Date;

   @OneToMany(() => MethodologyAssessmentParameters, (as) => as.assessment, {
       cascade: false,
       nullable: true,
       eager: true,
     })
     @JoinColumn()
     parameters: MethodologyAssessmentParameters[];

}
