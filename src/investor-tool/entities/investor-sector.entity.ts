import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { AssessmentCMDetail } from "src/carbon-market/entity/assessment-cm-detail.entity";

@Entity()
export class InvestorSector extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @ManyToOne((type) => InvestorTool, { cascade: false, nullable: true})
    @JoinColumn({ name: 'investortool_id' })
    investorTool?: InvestorTool;

    @ManyToOne((type) => AssessmentCMDetail, { cascade: false, nullable: true })
    @JoinColumn()
    assessmentCMDetail?: AssessmentCMDetail;

    @ManyToOne((type) => Sector, { cascade: false,eager:true })
    @JoinColumn({ name: 'sector_id' })
    sector?: Sector;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;


}
