import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { SystemStatusService } from './system-status.service';

@Controller('system-status')
export class SystemStatusController {
  constructor(private readonly systemStatusService: SystemStatusService) {}

  @Get('get-system-status')
  async systemStatus(){
    return await this.systemStatusService.isDeploying();
  }

  @Put('change-system-status')
  async changeSystemStatus(@Query('status') status: string){
   await this.systemStatusService.setIsDeploying(parseInt(status));
  }
}
