import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { Country } from "src/country/entity/country.entity";
import { Portfolio } from "src/portfolio/entities/portfolio.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    reportName: string;

    @ManyToOne(() => Country, { cascade:false })
    country: Country;

    @ManyToOne(() => ClimateAction, { cascade:false })
    climateAction: ClimateAction;


   



    @Column()
    generateReportName: string;

    @Column()
    savedLocation: string;

    @Column({ default: null })
    description: string;

    @Column({ default: null })
    tool: string;
    @Column({ default: null })
    type: string;

    @Column({ default: 'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg' })
    thumbnail: string;

    @ManyToOne(() => Portfolio)
    portfolio: Portfolio;
}
