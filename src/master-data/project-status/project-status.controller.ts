import { Controller, Get } from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';
import { ProjectStatus } from './project-status.entity';
import { ProjectStatusService } from './project-status.service';

@Crud({
  model: {
    type: ProjectStatus,
  },
  query: {
    join: {
    },
  },
})
@Controller('project-status')
export class ProjectStatusController implements CrudController<ProjectStatus> {
  constructor(public service: ProjectStatusService) { }

  get base(): CrudController<ProjectStatus> {
    return this;
  }

  @Get('get-all-project-status')
  async getAllProjectStatus(): Promise<ProjectStatus[]> {
    return await this.service.getAllProjectStatus();
  }

}
