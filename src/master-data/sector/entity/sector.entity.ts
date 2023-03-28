import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { CountrySector } from 'src/country/entity/country-sector.entity';
import { Country } from 'src/country/entity/country.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({name: 'sector'})
export class Sector extends BaseTrackingEntity{
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @OneToMany(() => ClimateAction, climateAction => climateAction.sector)
  climateAction: ClimateAction[];

  @OneToMany(() => CountrySector, countrySector => countrySector.sector)
  countrysector: CountrySector[];
  
  



  

  
  /*
  @ManyToMany((type) => Sector, {
    eager: true,
    cascade: false,
  })
  @JoinTable({ name: 'country_sector' })
  Sector?: Sector[];*/

  //new added
  


  
}
