import { Tool } from "../enum/tool.enum";

export class UpdateDeadlineDto {
    ids?: number[];
    deadline?: Date;
    status?: number;
    userId?: number;
    comment?: string;
    tool?: Tool
  }
  