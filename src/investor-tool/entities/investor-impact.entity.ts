
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";

@Entity()
export class InvestorImpacts extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @ManyToOne((type) => InvestorTool, { cascade: false })
    @JoinColumn({ name: 'investortool_id' })
    investorTool?: InvestorTool;


    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;



}
