import { Injectable } from "@nestjs/common";
import { answers, criterias, questions, sections } from "../dto/seed-data";
import { InjectRepository } from "@nestjs/typeorm";
import { Section } from "../entity/section.entity";
import { Criteria } from "../entity/criteria.entity";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { CMQuestionService } from "./cm-question.service";
import { Repository } from "typeorm";

@Injectable()
export class CMSeedService {

    constructor(
        @InjectRepository(Section) private sectionRepo: Repository<Section>,
        @InjectRepository(Criteria) private criteriaRepo: Repository<Criteria>,
        @InjectRepository(CMQuestion) private questionRepo: Repository<CMQuestion>,
        @InjectRepository(CMAnswer) private answerRepo: Repository<CMAnswer>,
        private questionService: CMQuestionService
    ){}

    async sectionSeed(){
        let _sections: Section[] = []
        for await (let section of sections) {
            let exist = await this.sectionRepo.createQueryBuilder('se').where('se.code = :code', {code: section.code}).getMany()
            if (exist.length === 0){
                let sec = new Section()
                sec.name = section.name
                sec.code = section.code
                sec.order = section.order

                _sections.push(sec)
            }
        }
        if (_sections.length > 0){
            let res = this.sectionRepo.save(_sections)
            if (res) {
                return "saved"
            } else {
                return "failed to save"
            }
        } else {
            return "All the sections are saved"
        }
    }

    async criteriaSeed() {
        let _criterias: Criteria[] = []
        for await (let criteria of criterias) {
            let exist = await this.criteriaRepo.createQueryBuilder('criteria').where('code = :code', {code: criteria.code}).getOne()
            if (!exist) {
                let section = await this.sectionRepo.createQueryBuilder('se').where('se.code = :code', {code: criteria.section}).getOne()
                let cri = new Criteria()
                cri.name = criteria.name
                cri.code = criteria.code
                cri.section = section
                cri.order = criteria.order

                _criterias.push(cri)
            }
        }
        if (_criterias.length > 0) {
            let res = this.criteriaRepo.save(_criterias)
            if (res) {
                return "saved"
            } else {
                return "failed to save"
            }
        } else {
            return "All the criterias are saved"
        }
    }

    async questionSeed() {
        let _questions: CMQuestion[] = []
        for await (let question of questions){
            let exist = await this.questionRepo.createQueryBuilder('qu').where('qu.code = :code', {code: question.code}).getMany()
            if (exist.length === 0){
                let criteria = await this.criteriaRepo.createQueryBuilder('cr').where('cr.code = :code', {code: question.criteria}).getOne()
                let q = new CMQuestion()
                q.label = question.label
                q.code = question.code
                q.order = question.order
                q.answer_type = question.answer_type
                q.criteria = criteria

                _questions.push(q)
            }
        }
        if (_questions.length > 0) {
            let res = this.questionRepo.save(_questions)
            if (res) {
                return "saved"
            } else {
                return "failed to save"
            }
        } else {
            return "All the questions are saved"
        }

    }

    async answerSeed() {
        let _answers: CMAnswer[] = []
        for await (let answer of answers){
            let exist = await this.answerRepo.createQueryBuilder('an').where('an.code = :code', {code: answer.code}).getMany()
            if (exist.length === 0 ){
                let question = await this.questionRepo.createQueryBuilder('qu').where('qu.code = :code', {code: answer.question}).getOne()
                let a = new CMAnswer()
                a.label = answer.label
                a.code = answer.code
                a.isPassing = answer.isPassing
                a.weight = answer.weight
                a.score_portion = answer.score_portion
                a.question = question

                _answers.push(a)
            }
        }
        if (_answers.length > 0) {
            let res = this.answerRepo.save(_answers)
            if (res) {
                return "saved"
            } else {
                return "failed to save"
            }
        } else {
            return "All the answers are saved"
        }
    }

    async updateQuestionSeed() {
        let response = {}
        let _questions: CMQuestion[] = []
        for await (let question of questions){
            let q = await this.questionRepo.createQueryBuilder('qu').where('qu.code = :code', {code: question.code}).getOne()
            if (q){
                q.message = question.message
                q.label = question.label
                _questions.push(q)
            } else {
                response[question.code] = 'Not found'
            }
        }

        if (_questions.length > 0){
            let res = this.questionRepo.save(_questions)
            if (res) {
                return {res: response, status: "saved"}
            } else { 
                return {res: response, status: "failed to save"}
            }
        }  else {
            return {res: response, status: "Nothing to save"}
        }
        
    }

    async updateAnswerSeed() {
        let response = {}
        let _answers: CMAnswer[] = []
        for await (let ans of answers){
            let a = await this.answerRepo.createQueryBuilder('an').where('an.code = :code', {code: ans.code}).getOne()
            if (a){
                a.label = ans.label
                _answers.push(a)
            } else {
                response[ans.code] = 'Not found'
            }
        }

        if (_answers.length > 0){
            let res = this.answerRepo.save(_answers)
            if (res) {
                return {res: response, status: "saved"}
            } else { 
                return {res: response, status: "failed to save"}
            }
        }  else {
            return {res: response, status: "Nothing to save"}
        }
        
    }
}