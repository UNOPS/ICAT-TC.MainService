
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Portfolio } from "./portfolio.entity";

@Entity()
export class PortfolioAssessment {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Assessment, { cascade: false , nullable: true, eager: true,})
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Portfolio, { cascade: false , nullable: true, eager: true,})
    @JoinColumn({ name: 'portfolio_id' })
    portfolio?: Portfolio;
}
