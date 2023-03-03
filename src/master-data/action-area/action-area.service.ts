import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ActionArea } from './entity/action-area.entity';

@Injectable()
export class ActionAreaService extends TypeOrmCrudService<ActionArea>{
    constructor(@InjectRepository(ActionArea) repo) {
        super(repo);
      }
}
