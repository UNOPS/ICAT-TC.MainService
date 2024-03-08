import { Crud, CrudController } from "@nestjsx/crud";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMQuestionService } from "../service/cm-question.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UniqueCategories } from "../dto/cm-result.dto";


@Crud({
  model: {
    type: CMQuestion,
  },
  query: {
    join: {
      criteria: {
        eager: true
      }
    },
  },
})
@Controller('cm-question')
export class CMQuestionController implements CrudController<CMQuestion>
{
  constructor(public service: CMQuestionService,
  ) { }

  get base(): CrudController<CMQuestion> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all-section')
  async getAllSection(){
    return await this.service.getAllSection();
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-criteria-by-section')
  async getCriteriaBySectionId(@Query('sectionId') sectionId: number){
    return await this.service.getCriteriaBySectionId(sectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-question-by-criteria')
  async getQuestionsByCriteria(@Query('criteriaId') criteriaId: number){
    return await this.service.getQuestionsByCriteria(criteriaId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('get-answers-by-question')
  async getAnswersByQuestion(@Query('questionId') questionId: number){
    return await this.service.getAnswersByQuestion(questionId);
  }

  @Get('get-unique-characteristics')
  async getUniqueCharacterisctics():Promise<UniqueCategories>{
    return await this.service.getUniqueCharacterisctics();
  }

  @Get('get-questions-by-characteristic')
  async getQuestionsByCharacteristic(@Query('characteristicId') characteristicId: number[]):Promise<any>{
    return await this.service.getQuestionsByCharacteristicId(characteristicId);
  }

}
