
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DataRequestStatus } from './data-request-status.entity';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';
import { Tool } from '../enum/tool.enum';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';

@Entity({ name: 'datarequest' })
export class ParameterRequest extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => MethodologyAssessmentParameters, { cascade: false, onUpdate: 'RESTRICT' ,eager: true})
  @JoinColumn({ name: 'ParameterId' })
  parameter?: MethodologyAssessmentParameters;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ nullable: true })
  deadlineDataEntry: Date;

  @Column({ nullable: true })
  reasonForExceedRange: string;

  @Column({ nullable: true })
  requestedDate: Date;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  valueInParameterStandard?: string;

  @Column({ nullable: true })
  noteDataRequest?: string;

  @Column({ nullable: true })
  noteDataEntry?: string;

  @Column({ nullable: true })
  noteDataApprover?: string;

  @Column({ nullable: true })
  noteCase1?: string;

  @Column({ nullable: true })
  noteCase2?: string;

  @Column({ nullable: true })
  noteCase3?: string;

  @Column({ nullable: true })
  UserDataEntry?: number;

  @Column({ nullable: true })
  UserIdFerfyie?: number;
  
  @Column({ nullable: true })
  UserQA?: number;

  @Column({ nullable: true })
  dataRequestStatus?: DataRequestStatus;

  @Column({ nullable: true })
  qaStatus?: QuAlityCheckStatus;

  @Column({ nullable: true })
  qaStatusUpdatedDate: Date;

  @Column({ nullable: true })
  qaDeadline: Date;

  @Column({ nullable: true })
  qaAssighnDate: Date;

  @Column({ nullable: true })
  qaComment: string;

  @Column({ nullable: true })
  qcUserName: string;

  @ManyToOne((type) => CMAssessmentAnswer, {nullable: true,eager:true})
  @JoinColumn()
  cmAssessmentAnswer: CMAssessmentAnswer

  @ManyToOne((type) => InvestorAssessment, {nullable: true, eager:true})
  @JoinColumn()
  investmentParameter: InvestorAssessment


  @Column()
  tool: Tool

}
