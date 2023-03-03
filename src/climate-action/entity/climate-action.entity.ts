import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { type } from 'os';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { FinancingScheme } from 'src/master-data/financing-scheme/financing-scheme.entity';
import { AggregatedAction } from 'src/master-data/aggregated-action/entity/aggregated-action.entity';
import { ProjectApprovalStatus } from 'src/master-data/project-approval-status/project-approval-status.entity';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { Sector } from 'src/master-data/sector/entity/sector.entity';

import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActionArea } from 'src/master-data/action-area/entity/action-area.entity';

@Entity({ name: 'climateAction'})
export class ClimateAction extends BaseTrackingEntity {
  /**
   *
   */
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  policyName: string; // name of the policy

  @Column({ default: null })
  description: string; // description of the policy

  @Column({ length: 50, default: null, nullable: true })
  contactPersoFullName: string;  // full name

  @Column({ length: 30, default: null, nullable: true })
  email: string;  //email

  @Column({ length: 30, default: null, nullable: true })
  contactPersonDesignation: string; // designation

  @Column()
  telephoneNumber: string;  // telephone number 

  @Column({ default: null })
  mobileNumber: string;  // mobile number 

  @Column({ default: null })
  typeofAction: string;

  @Column({length: 500, default: null, nullable: true  })
  defenitionofAssessment: string;

  @ManyToOne((type) => Institution, { cascade: false, nullable: true })
  @JoinColumn()
  mappedInstitution?: Institution;//

  @ManyToOne((type) => Country, { cascade: false })
  @JoinColumn({ name: 'countryId' })
  country?: Country; // country of the policy
  
  @ManyToOne(() => Sector, { cascade: false })
  sector?: Sector;

 

  @ManyToOne(() => AggregatedAction, { cascade: false })
  aggregatedAction: AggregatedAction; //ndc

  @ManyToOne(() => ActionArea, { cascade: false })
  actionArea: ActionArea; // subndc

  

  @ManyToOne((type) => ProjectStatus, { cascade: false })
  @JoinColumn()
  projectStatus?: ProjectStatus;

  @Column({ default: null })
  policyScope: string;  //scope of the policy 

  @ManyToOne((type) => ProjectOwner, { cascade: false })
  @JoinColumn()
  projectOwner?: ProjectOwner;



  @Column({ default: null })
  acceptedDate: Date;

  @Column()
  proposeDateofCommence: Date; // proposed date

  @Column() 
  duration: number;  //project duration 

  @Column({ length: 500, default: null, nullable: true })
  objective: string; // objectives of the policy


  //location
  @Column({ default: null, nullable: true })
  subNationalLevl1: string;

  @Column({ default: null, nullable: true })
  subNationalLevl2: string;

  @Column({ default: null })
  subNationalLevl3: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
    nullable: true,
  })
  longitude: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
    nullable: true,
  })
  latitude: number;
  
  @Column({default: null, nullable: true  })
  geographicCoverage: string;
  

  // outcome
  @Column({ length: 500, default: null, nullable: true })
  outcome: string;

  @Column({ length: 500, default: null, nullable: true })
  contextOfPolicy: string;

  @Column({ length: 500,default: null, nullable: true })
  intendedImpacts: string;

  @Column({ length: 500, default: null, nullable: true })
  adaptationBenefits: string;

  @Column({ length: 500, default: null })
  directSDBenefit: string;

  @Column({ length: 500, default: null })
  indirectSDBenefit: string;

  //stakeholders
  @Column({ default: null })
  implementingEntity: string;

  @Column({ default: null })
  executingEntity: string;

  @Column({ length: 300, default: null })
  partiesInvolved?: string;

  @Column({ length: 300, default: null })
  beneficiaries: string;

  // @ManyToOne((type) => FinancingScheme, {
  //   cascade: false,
  // })
  // @JoinColumn()
  // financingScheme?: FinancingScheme;

  // @Column({ length: 100, default: null })
  // donors: string;

  // @Column({ length: 100, default: null })
  // investors: string;

  // @Column({ length: 300, default: null })
  // fundingOrganization: string;

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  // initialInvestment?: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  // annualFunding?: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  // annualRevenue?: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  // expectedRecurrentExpenditure;

  //For mistgation actions - related to climate action table in future


  @ManyToOne((type) => ProjectApprovalStatus, { cascade: false })
  @JoinColumn()
  projectApprovalStatus?: ProjectApprovalStatus;

  @Column({ default: null })
  projectRejectComment: string;

  @Column({ default: null })
  projectDataRequsetComment: string;

  @Column({ default: null })
  isDelete: boolean;

  @Column({ length: 500, default: null, nullable: true })
  barriers: string;
  
  @Column({ length: 500, default: null, nullable: true })
  otherRelatedActivities: string;
}
