import { Query } from "@nestjs/common";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Country } from "src/country/entity/country.entity";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ImpactCovered } from "./impact-covered.entity";

@Entity()
export class InvestorTool extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    level_of_implemetation: string;

    @Column({ nullable: true })
    geographical_areas_covered: string;

    @Column({ nullable: true })
    national_country: string;

    @Column({ nullable: true })
    investment_type: string;

    @Column({ nullable: true })
    subnational_region: string;
    
    @ManyToOne((type) => Assessment, { cascade: false ,eager:true})
    @JoinColumn({ name: 'assessment_id' })
    assessment: Assessment;


}

