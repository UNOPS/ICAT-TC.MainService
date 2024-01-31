
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { AggregatedAction } from 'src/master-data/aggregated-action/entity/aggregated-action.entity';
import { ProjectApprovalStatus } from 'src/master-data/project-approval-status/project-approval-status.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { Sector } from 'src/master-data/sector/entity/sector.entity';

import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActionArea } from 'src/master-data/action-area/entity/action-area.entity';
import { User } from 'src/users/entity/user.entity';
import { PolicySector } from './policy-sectors.entity';

@Entity({ name: 'climateaction'})
export class ClimateAction extends BaseTrackingEntity {

  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 150})
  policyName: string; 


  @Column({ default: null, type: 'varchar', length: 1500})
  description: string; 


  @Column({ length: 50, default: null, nullable: true })
  contactPersoFullName: string; 

  @Column({ length: 30, default: null, nullable: true })
  email: string;

  @Column({ length: 30, default: null, nullable: true })
  contactPersonDesignation: string;

  @Column({ default: null })
  telephoneNumber: string; 

  @Column({ default: null })
  mobileNumber: string; 

  @Column({ default: null })
  typeofAction: string;


  @ManyToOne((type) => Institution, { cascade: false, nullable: true , eager:false})
  @JoinColumn()
  mappedInstitution?: Institution;

  @ManyToOne((type) => Country, { cascade: false ,eager:true})
  @JoinColumn({ name: 'countryId' })
  country?: Country; 
  
  @ManyToOne(() => Sector, { cascade: false })
  sector?: Sector;

 

  @ManyToOne(() => AggregatedAction, { cascade: false, nullable: true })
  aggregatedAction: AggregatedAction; 

  @ManyToOne(() => ActionArea, { cascade: false, nullable: true })
  actionArea: ActionArea; 

  

  @ManyToOne((type) => ProjectStatus, { cascade: false , eager : true})
  @JoinColumn()
  projectStatus?: ProjectStatus;


  @Column({ default: null })
  acceptedDate: Date;

  @Column()
  proposeDateofCommence: Date; 

  @Column({ length: 1500, default: null, nullable: true })
  objective: string; 

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
  
  @Column({default: null, nullable: true, length: 1500  })
  geographicCoverage: string;
  

  @Column({ default: null,  length: 500})
  implementingEntity: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  initialInvestment?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  tc_value?: number;



  @ManyToOne((type) => ProjectApprovalStatus, { cascade: false,nullable: true })
  @JoinColumn()
  projectApprovalStatus?: ProjectApprovalStatus;

  @Column({ default: null })
  projectRejectComment: string;

  @Column({ default: null })
  projectDataRequsetComment: string;

  @Column({ default: null })
  isDelete: boolean;
  
  @Column({ length: 500, default: null, nullable: true })
  otherRelatedActivities: string;
  
  @Column({ length: 500, default: null, nullable: true })
  actionJustification: string;

  @OneToMany(() => PolicySector, policySector => policySector.intervention,{cascade: false, nullable: true,eager: true,})
  @JoinColumn()
    policySector: PolicySector[];

  @Column({ default: null , nullable: true})
  intervention_id: string;

  @Column({ default: null , nullable: true})
  levelofImplemenation: string;

  @Column({ default: null , nullable: true})
  geographicalAreaCovered: string;

  @Column({ default: null })
  dateOfImplementation: Date;

  @Column({ default: null })
  dateOfCompletion: Date;

  @Column({ type: 'longtext', default: null, nullable: true })
  vision_long: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  vision_medium: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  vision_short: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  envisioned_change: string;

  @Column({ type: 'longtext', default: null, nullable: true })
  phase_of_transformation: string;
  
  @Column({ type: 'longtext', default: null, nullable: true })
  change_in_system: string;

  @Column({ length: 100, default: null, nullable: true })
  location_country: string;

  @Column({ length: 1500, default: null, nullable: true })
  related_policies: string;

  @Column({ length: 1500, default: null, nullable: true })
  reference: string;

  @Column({type: 'int', nullable: true,})
  likelyhood: number;

  @Column({type: 'int', nullable: true,})
  politicalPreference: number;
  
  @Column({type: 'int', nullable: true,})
  financialFecialbility: number;
  
  @Column({type: 'int', nullable: true,})
  availabilityOfTechnology: number;

  @Column({type: 'int', nullable: true,})
  isCity: number;

  @Column({ length: 500, default: null, nullable: true })
  institute: string;


  @ManyToOne((type) => User, { cascade: false, eager: true, })
  @JoinColumn({ name: 'user_id' })
  user?: User; 


  @OneToMany(() => PolicySector, (as) => as.intervention, {
    cascade: false,
    nullable: true,
    eager: true
  })
  @JoinColumn()
  policy_sector: PolicySector[];
}
