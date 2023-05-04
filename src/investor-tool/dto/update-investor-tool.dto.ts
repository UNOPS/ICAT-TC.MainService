import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestorToolDto } from './create-investor-tool.dto';

export class UpdateInvestorToolDto extends PartialType(CreateInvestorToolDto) {}
