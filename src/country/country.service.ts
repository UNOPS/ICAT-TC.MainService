import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CountrySector } from './entity/country-sector.entity';
import { Country } from './entity/country.entity';

@Injectable()
export class CountryService extends TypeOrmCrudService<Country>{
    constructor(
        @InjectRepository(Country)repo,
        @InjectRepository(CountrySector)
        public CountrySectorRepo: Repository<CountrySector>,


        ){
        super(repo);
    }


    async getCountry(countryId: number) : Promise<any>{
      let  data = this.repo.createQueryBuilder('cou')
          .leftJoinAndMapMany(
            'cou.countrysector',
            CountrySector,
            'cs',
            `cou.id = cs.countryId `,
          )
          .where(
            `cou.id = ${countryId}`
          )
      return await data.getOne();
  
      
  }
  async getCountrySector(countryId: number){
     const countrySector = await this.CountrySectorRepo.find({
      where:{ country:{id:countryId}}
  });
  return countrySector;
  }

  
}
