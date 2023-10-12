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

    @Post('update-answer-seed')
    async updateAnswerSeed(){
        return await this.service.updateAnswerSeed()
    }

    @Post('update-characteristics-seed')
    async updateCharacteristicsSeed(){
        return await this.service.updateCharacteristicsByName()
    }

    @Post('update-section-seed')
    async updateSectionSeed(){
        return await this.service.updateSectionSeed()
    }

    @Post('update-criteria-seed')
    async updateCriteiraSeed(){
        return await this.service.updateCriteriaSeed()
    }

    @Post('update-category-seed')
    async updateCategorySeed(){
        return await this.service.updateCategoryByName()
    }

    @Post('delete-not-using-questions')
    async deleteNotUsingQuestions(){
        return await this.service.deleteNotUsingQuestions()
    }

    @Post('delete-not-using-answers')
    async deletNotUsingAnswers(){
        return await this.service.deleteNotUsingAnswers()
    }

    @Post('update-tool-name-in-assessment')
    async updateToolNameInAssessment(){
        return await this.service.updateToolNameInAssessment()
    }
}