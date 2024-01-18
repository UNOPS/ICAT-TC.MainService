import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { VerificationStatus } from './verification-status.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';

@Entity({ name: 'verificationdetail' })
export class VerificationDetail extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
    this.isAccepted = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;


  @Column({ nullable: true })
  updatedDate: Date;

  @Column({ nullable: true })
  rootCause?: string;

  @Column({ nullable: true })
  explanation?: string;

  @Column({ nullable: true })
  correctiveAction?: string;

  @Column({ nullable: true })
  action?: string;

  @Column({ nullable: false })
  isAccepted: boolean;


  @Column({ default: false })
  isResult: boolean;

  @Column({ default: false })
  isDataRequested: boolean;

  @Column({ nullable: true })
  verificationStatus: VerificationStatus;

  @Column({ default: 1 })
  verificationStage: number;

  @Column({ nullable: true })
  userVerifier?: number;


  @Column({ nullable: true })
  assumption: string;

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  assessment: Assessment

  @ManyToOne(() => MethodologyAssessmentParameters)
  @JoinColumn()
  public parameter: MethodologyAssessmentParameters;
}
