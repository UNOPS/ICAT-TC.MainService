import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PortfolioSdg } from "./portfolio-sdg.entity";
import { Country } from "src/country/entity/country.entity";

@Entity()
export class SdgPriority extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    priority: string //code

    @Column({nullable: true})
    value: number

    @ManyToOne((type) => PortfolioSdg)
    @JoinColumn()
    sdg: PortfolioSdg

    @ManyToOne((type) => Country)
    @JoinColumn()
    country: Country

}