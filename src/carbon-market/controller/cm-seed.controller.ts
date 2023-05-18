import { Controller, Post } from "@nestjs/common";
import { CMSeedService } from "../service/cm-seed.service";

@Controller('cm-seed')
export class CMSeedController {

    constructor(
        private service: CMSeedService
    ){}

    @Post('section-seed')
    async sectionSeed(){
        return await this.service.sectionSeed()
    }

    @Post('criteria-seed')
    async criteriaSeed(){
        return await this.service.criteriaSeed()
    }
    
    @Post('question-seed')
    async questionSeed(){
        return await this.service.questionSeed()
    }

    @Post('answer-seed')
    async answerSeed(){
        return await this.service.answerSeed()
    }

    @Post('update-question-seed')
    async updateQuestionSeed(){
        return await this.service.updateQuestionSeed()
    }
}