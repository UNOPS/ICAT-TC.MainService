import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CountrySector } from 'src/country/entity/country-sector.entity';
import { Repository } from 'typeorm';
import { Sector } from './entity/sector.entity';

@Injectable()
export class SectorService extends TypeOrmCrudService<Sector> {
  constructor(
    @InjectRepository(Sector) repo,
    @InjectRepository(CountrySector)
    private readonly CountrySectorRepo: Repository<CountrySector>,) {
    super(repo);
  }


  async getSectorDetails(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<Sector>> {
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(sr.name LIKE :filterText OR sr.description LIKE :filterText OR subsr.name LIKE :filterText)';
    }

    let data = this.repo
      .createQueryBuilder('sr')


      .where(filter, {
        filterText: `%${filterText}%`,

      })
      .orderBy('sr.createdOn', 'DESC');;

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }


  async findAll() {
    this.repo.find()
  }

  async getCountrySector(countryId: number):Promise<Sector[]> {
    let resualt = new Array()
    let ids = await this.CountrySectorRepo.find({ where: { country:{id:countryId}} ,relations: ['country','sector'] });

    for await (let a of ids) {
      let sector = await this.repo.findOne({ where: { id: a.sector.id },
       });
      resualt.push(sector);
    }

    return resualt;



  }
}
