import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
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


/*
    async updateCountry(req:CrudRequest, dto:Country)
    {
        let coun = await this.repo.update(dto.id,dto);
     
        var x:number = 0
        dto.countrysector.map((a) => {

           a.country.id = dto.id;
           a.sector.id = dto.countrysector[x].sector.id
           x++;
          
         });
         

         try {
          dto.countrysector.map(async (a) => {
            let lms = await this.CountrySectorRepo.save(await a);
          });
        } catch (error) {
          console.log(error);
        }

       
       
        return coun;
    }


    */

    async getCountry(countryId: number) {
      let data;
      if (countryId != 0) {
        data = this.repo.createQueryBuilder('cou')
          .leftJoinAndMapMany(
            'cou.countrysector',
            CountrySector,
            'cs',
            `cou.id = cs.countryId `,
          )
          .where(
            `cou.id = ${countryId}`
          )
        
      }else{}
      return data.getOne();
  
      
  }
  async getCountrySector(countryId: number){
     const countrySector = await this.CountrySectorRepo.find({
      where:{ country:{id:countryId}}
  })
  console.log("countrySector",countrySector)
  return countrySector;
  }

  
}
