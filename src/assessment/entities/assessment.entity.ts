
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity'
import { Methodology } from "src/methodology-assessment/entities/methodology.entity";
import { QuAlityCheckStatus } from "src/quality-check/entity/quality-check-status.entity";
import { MethodologyAssessmentParameters } from "src/methodology-assessment/entities/methodology-assessment-parameters.entity";
@Entity()
export class Assessment {

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
    qaAssighnDate?: string;

    @Column({ nullable: true })
    qaDeadline?: Date;

    @OneToMany(() => MethodologyAssessmentParameters, (as) => as.assessment, {
        cascade: false,
        nullable: true,
        eager: true,
      })
      @JoinColumn()
      parameters: MethodologyAssessmentParameters[];

}
