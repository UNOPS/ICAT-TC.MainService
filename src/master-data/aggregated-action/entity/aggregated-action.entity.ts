import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { Country } from 'src/country/entity/country.entity';
import { ActionArea } from 'src/master-data/action-area/entity/action-area.entity';
import { Sector } from 'src/master-data/sector/entity/sector.entity';
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
import { NdcSet } from '../ndc-set.entity';


@Entity({name: 'aggregated_action'})
export class AggregatedAction extends BaseTrackingEntity{
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;
 

  @OneToMany(() => ActionArea, actionArea => actionArea.aggregatedAction)
  actionArea: ActionArea[];



  

  @ManyToOne((type) => NdcSet, { cascade: false })
  // @JoinColumn()
  set: NdcSet;

  @ManyToOne((type) => Country, { cascade: false })
  country: Country;

  @ManyToOne((type) => Sector, { cascade: false })
  sector: Sector;


  

  
}
