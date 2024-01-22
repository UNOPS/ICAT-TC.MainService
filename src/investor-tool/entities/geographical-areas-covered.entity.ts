
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { AssessmentCMDetail } from "src/carbon-market/entity/assessment-cm-detail.entity";

@Entity()
export class GeographicalAreasCovered extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    code: string;

    @ManyToOne((type) => InvestorTool, { cascade: false, nullable: true})
    @JoinColumn()
    investorTool?: InvestorTool;

    @ManyToOne((type) => AssessmentCMDetail, { cascade: false, nullable: true })
    @JoinColumn()
    assessmentCMDetail?: AssessmentCMDetail;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn()
    assessment?: Assessment;


}
