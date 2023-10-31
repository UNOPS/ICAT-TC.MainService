
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity'
import { Methodology } from "src/methodology-assessment/entities/methodology.entity";
import { QuAlityCheckStatus } from "src/quality-check/entity/quality-check-status.entity";
import { VerificationStatus } from "src/verification/entity/verification-status.entity";
import { User } from "src/users/entity/user.entity";
import { MethodologyAssessmentParameters } from "src/methodology-assessment/entities/methodology-assessment-parameters.entity";
import { InvestorAssessment } from "src/investor-tool/entities/investor-assessment.entity";
import { InvestorTool } from "src/investor-tool/entities/investor-tool.entity";
import { AssessmentBarriers } from "src/methodology-assessment/entities/assessmentbarriers.entity";
import { InvestorSector } from "src/investor-tool/entities/investor-sector.entity";
import { ApiHideProperty } from "@nestjs/swagger";
import { SdgAssessment } from "src/investor-tool/entities/sdg-assessment.entity";
import { PolicyBarriers } from "src/climate-action/entity/policy-barriers.entity";
import { GeographicalAreasCovered } from "src/investor-tool/entities/geographical-areas-covered.entity";

@Entity()
export class Assessment extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  year: string;

  @ManyToOne((type) => ClimateAction, { cascade: false, eager: true, })
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
  from: Date;

  @Column({ nullable: true })
  to: Date;

  @Column({ nullable: true })
  assessment_method: string; //track , track 2

  @Column({ nullable: true })
  assessment_approach: string; //direct, indirect

  @Column({ nullable: true })
  qaStatus?: QuAlityCheckStatus;

  @Column({ nullable: true })
  person: string;

  @Column({ type: 'longtext', nullable: true })
  opportunities: string;

  @Column({ type: 'longtext', nullable: true })
  principles: string;

  @Column({ type: "mediumtext", nullable: true })
  audience?: string;

  @Column({ type: "mediumtext", nullable: true })
  assessBoundry?: string;

  @Column({ type: "mediumtext", nullable: true })
  impactsCovered?: string;

  @Column({ nullable: true })
  verificationStatus?: VerificationStatus;

  @Column({ nullable: true })
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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  tc_value?: number;

  @ManyToOne((type) => User, { cascade: false, eager: false, })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'int', nullable: true })
  process_score: number;

  @Column({ type: 'int', nullable: true })
  outcome_score: number;


  @Column({ type: 'longtext', default: null, nullable: true })
  envisioned_change: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  vision_short: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  vision_medium: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  vision_long: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  phase_of_transformation: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  change_in_system: string;

  @Column({ default: false })
  isDraft: boolean

  @Column({ nullable: true })
  processDraftLocation?: string;

  @Column({ nullable: true })
  outcomeDraftLocation?: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  additioinalInfo: string;


  @ApiHideProperty()
  investor_assessment: InvestorAssessment[] = []
  @ApiHideProperty()
  policy_barrier: PolicyBarriers[];
  @ApiHideProperty()
  investor_tool: InvestorTool;
  @ApiHideProperty()
  investor_sector: InvestorSector[];
  @ApiHideProperty()
  assessment_barriers: AssessmentBarriers[];
  @ApiHideProperty()
  geographical_areas_covered: GeographicalAreasCovered[];

}


