import { Injectable } from '@nestjs/common';
import { CreateSystemStatusDto } from './dto/create-system-status.dto';
import { UpdateSystemStatusDto } from './dto/update-system-status.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SystemStatus } from './entities/system-status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SystemStatusService extends TypeOrmCrudService<SystemStatus> {
  constructor(
    @InjectRepository(SystemStatus) repo,
  ) {
    super(repo);
  }

  async isDeploying(){
    let s = await this.repo.findOne({
        where: { id: 1}
      });
    return s?.isDeploying || 0
  }


  async setIsDeploying(status: number){
    let s = await this.repo.findOne({
      where: { id: 1}
    });
    if(s){
      await this.repo.update({id: 1},{isDeploying: status});
    }else{
      let ss = new SystemStatus();
      ss.isDeploying=status
      await this.repo.save(ss);
    }
  }
}
