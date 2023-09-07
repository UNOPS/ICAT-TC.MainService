import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AggregatedAction } from './entity/aggregated-action.entity';
import { NdcService } from './aggregated-action.service';
import { Request, Post, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedBody,
  ParsedRequest,
  CrudRequest,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
//import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: AggregatedAction,
  },
  query: {
    join: {
      set: {
        eager: true,
      },
      country: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      actionArea: {
        eager: true,
      },
      assessment: {
        eager: true,
      },
      climateAction: {
        eager: true,
      },
    },
  },
})
@Controller('ndc')
export class NdcController implements CrudController<AggregatedAction> {
  constructor(public service: NdcService,
    //private readonly tokenDetails:TokenDetails,
    ) {}

  get base(): CrudController<AggregatedAction> {
    return this;
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
    @Request() req2,
  ): Promise<GetManyDefaultResponse<AggregatedAction> | AggregatedAction[]> {
    try {
      let res = await this.base.getManyBase(req);
      // console.log("getManyBasendc",res)
      console.log('*********************************************');
      console.log("res",res);
      console.log('*********************************************');
      console.log("req",req);
      return res;
    } catch (error) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log(error);
    }
   }
   @UseGuards(JwtAuthGuard)
   @Get('ndc/ndcinfo/:page/:limit/:sectorIds')
   async getDateRequest(
     @Request() request,
     @Query('page') page: number,
     @Query('limit') limit: number,
     @Query('sectorIds') sectorIds: string[],
  
   ): Promise<any> {


   console.log('sectorIds',sectorIds)
    let countryIdFromTocken:number;
    let sectorIdFromTocken:number ;
   

  

   //[countryIdFromTocken,sectorIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])
    

     return await this.service.ndcSectorDetails(
       {
         limit: limit,
         page: page,
       },
       sectorIds,
       countryIdFromTocken,
       sectorIdFromTocken
     
     );
   }

   @UseGuards(JwtAuthGuard)
   @Get('ndcSectorDetailsDashboard')
   async ndcSectorDetailsDashboard(
     @Request() request,
     @Query('page') page: number,
     @Query('limit') limit: number,
     @Query('sectorIds') sectorId: number,
  
   ): Promise<any> {


  //  console.log('sectorIds',sectorIds)
    let countryIdFromTocken:number;
    let sectorIdFromTocken:number ;
   

  

   //[countryIdFromTocken,sectorIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])
    

     return await this.service.ndcSectorDetailsDashboard(
       {
         limit: limit,
         page: page,
       },
       sectorId,
       countryIdFromTocken,
       sectorIdFromTocken
     
     );
   }



   @UseGuards(JwtAuthGuard)
   @Get('getNdcForDashboard')
   async getNdcForDashboard(
     @Request() request,
     @Query('page') page: number,
     @Query('limit') limit: number,
     @Query('sectorId') sectorId: number,
  
   ): Promise<any> {


   
    let countryIdFromTocken:number;
    let sectorIdFromTocken:number ;
    let moduleLevelsFromTocken: number[];

  


     return await this.service.getNdcForDashboard(
       {
         limit: limit,
         page: page,
       },
       sectorId,
       countryIdFromTocken,
       sectorIdFromTocken,
       moduleLevelsFromTocken
     
     );
   }

   @Get('sub-ndc')
  async getSubNdc(
    @Query('ndcId') ndcId: number,
  ): Promise<any> {
    return await this.service.getSubNdc(ndcId);
  }



}
