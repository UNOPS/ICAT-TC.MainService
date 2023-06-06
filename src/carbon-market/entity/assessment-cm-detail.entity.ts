
// import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class AssessmentCMDetail extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectoral_boundary: string;

  @Column()
  temporal_boundary: string;

  @Column()
  geographical_boundary: string;

  @Column()
  impact_types: string

  @Column( { type: "varchar",length: 2000 })
  impact_categories: string

  @Column( { type: "varchar",length: 2000 })
  impact_characteristics: string

  @Column()
  impact_indicators:string

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  cmassessment: Assessment

  //need to implement and save here
  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  tc_value?: number;
}
