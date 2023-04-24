
// import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class AssessmentCMDetail extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boundraries: string;

  @Column()
  impact_types: string

  @Column()
  impact_categories: string

  @Column()
  impact_characteristics: string

  @Column()
  impact_indicators:string

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  assessment: Assessment
}
