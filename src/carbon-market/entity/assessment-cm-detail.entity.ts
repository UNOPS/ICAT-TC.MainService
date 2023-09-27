
// import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Dirent } from 'fs';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class AssessmentCMDetail extends BaseTrackingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boundraries: string

  @Column()
  intCMApproach: string

  @Column({default:'DIRECT'})
  otherIntCMApproach: string 

  @Column()
  appliedMethodology: string

  @ManyToOne((type) => Assessment)
  @JoinColumn()
  cmassessment: Assessment

   @Column({nullable:true})
  sectoral_boundary: string; 

  // @Column()
  // temporal_boundary: string;

  // @Column()
  // geographical_boundary: string;


  // @Column()
  // impact_types: string

  // @Column( { type: "varchar",length: 2000 })
  // impact_categories: string

  // @Column( { type: "varchar",length: 2000 })
  // impact_characteristics: string

  // @Column()
  // impact_indicators:string


}
