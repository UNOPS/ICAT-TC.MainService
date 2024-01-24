
import { Assessment } from "src/assessment/entities/assessment.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TotalInvestment } from "./total-investment.entity";

@Entity()
export class InvestorTool extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    level_of_implemetation: string;

    @Column({ nullable: true })
    national_country: string;

    @Column({ nullable: true })
    investment_type: string;

    @Column({ nullable: true })
    subnational_region: string;

    @Column({nullable: true})
    total_investment: number
    
    @ManyToOne((type) => Assessment, { cascade: false ,eager:true})
    @JoinColumn({ name: 'assessment_id' })
    assessment: Assessment;

    @OneToMany(() => TotalInvestment, (as) => as.investor_tool, {
        cascade: false,
        nullable: true,
    })
    @JoinColumn()
    total_investements: TotalInvestment[];
}

