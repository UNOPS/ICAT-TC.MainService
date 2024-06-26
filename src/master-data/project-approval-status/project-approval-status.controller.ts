import { Controller, Get } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ProjectApprovalStatus } from './project-approval-status.entity';
import { ProjectApprovalStatusService } from './project-approval-status.service';

@Crud({
  model: {
    type: ProjectApprovalStatus,
  },
  query: {
    join: {
    },
  },
})
@Controller('project-approval-status')
export class ProjectApprovalStatusController
  implements CrudController<ProjectApprovalStatus>
{
  constructor(public service: ProjectApprovalStatusService) {}

  get base(): CrudController<ProjectApprovalStatus> {
    return this;
  }

  @Get('get-all-project-approval-status')
  async getAllProjectApprovalStatus(
  ): Promise<any> {
    return await this.service.getAllProjectApprovalStatus();
  }
}
