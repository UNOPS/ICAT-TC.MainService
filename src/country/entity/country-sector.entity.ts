
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";

@Entity({ name: 'country_sector' })
export class CountrySector extends BaseTrackingEntity {

    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      }
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Country, country => country.countrysector)
     country: Country;

    @ManyToOne(() => Sector, sector => sector.countrysector)
     sector: Sector;

    @Column()
    @Generated("uuid")
    uniqueIdentification: string;
		 	


}
