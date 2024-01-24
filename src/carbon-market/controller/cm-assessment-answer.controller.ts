import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { CMAssessmentAnswerService } from "../service/cm-assessment-answer.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { editFileName, excelFileFilter } from "src/utills/file-upload.utils";
import { diskStorage } from 'multer';


@Crud({
  model: {
    type: CMAssessmentAnswer,
  },
  query: {
    join: {
      assessment: {eager: true},
      question: {eager: true}
    },
  },
})
@Controller('cm-assessment-answer')
export class CMAssessmentAnswerController implements CrudController<CMAssessmentAnswer>
{
  constructor(public service: CMAssessmentAnswerService,
  ) { }

  get base(): CrudController<CMAssessmentAnswer> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async save(@Body() assessmentQuestion: CMAssessmentAnswer){
    return await this.service.create(assessmentQuestion)
  }

  @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: excelFileFilter,
        }),
    )
    async uploadFileExcel(@UploadedFile() file) {
        const newSavedfile = file.filename;
        await this.service.uplaodFileUpload(newSavedfile);
    }



}

