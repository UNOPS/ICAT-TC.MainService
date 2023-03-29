import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { AggregatedAction } from 'src/master-data/aggregated-action/entity/aggregated-action.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({name: 'action_area'})
export class ActionArea extends MasterData{
    

  

  @ManyToOne(() => AggregatedAction, aggregatedAction => aggregatedAction.actionArea)
  @JoinColumn()
  aggregatedAction: AggregatedAction;


  @OneToMany(() => ClimateAction, climateAction => climateAction.actionArea,{})
  climateAction: ClimateAction[];

 
  
  
}
