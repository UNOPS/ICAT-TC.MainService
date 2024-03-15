import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { AggregatedAction } from 'src/master-data/aggregated-action/entity/aggregated-action.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';


@Entity({name: 'action_area'})
export class ActionArea extends MasterData{
    

  

  @ManyToOne(() => AggregatedAction, aggregatedAction => aggregatedAction.actionArea)
  @JoinColumn({ name: 'aggregatedActionId' })
  aggregatedAction: AggregatedAction;


  @OneToMany(() => ClimateAction, climateAction => climateAction.actionArea,{})
  climateAction: ClimateAction[];

 
  
  
}
