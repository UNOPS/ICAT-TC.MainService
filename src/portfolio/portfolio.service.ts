import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PortfolioAssessment } from './entities/portfolioAssessment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PortfolioService extends TypeOrmCrudService <Portfolio> {

  constructor(
    @InjectRepository(Portfolio) repo, 
    @InjectRepository(PortfolioAssessment) private readonly portfolioAssessRepo: Repository<PortfolioAssessment>,
 
   ) {
    super(repo)
  }

  async create(createPortfolioDto: any) {
   let res=  await this.repo.save(createPortfolioDto);
    return res;
  }

}
