import { Injectable } from "@nestjs/common";
import { criterias, questions, sections } from "../dto/seed-data";
import { InjectRepository } from "@nestjs/typeorm";
import { Section } from "../entity/section.entity";
import { Repository } from "typeorm-next";
import { Criteria } from "../entity/criteria.entity";
import { CMQuestion } from "../entity/cm-question.entity";

@Injectable()
export class CMSeedService {

    constructor(
        @InjectRepository(Section) private sectionRepo: Repository<Section>,
        @InjectRepository(Criteria) private criteriaRepo: Repository<Criteria>,
        @InjectRepository(CMQuestion) private questionRepo: Repository<CMQuestion>
    ){}

    async sectionSeed(){
        let _sections: Section[] = []
        for await (let section of sections) {
            let exist = await this.sectionRepo.find({code: section.code})
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
            console.log(exist)
            if (!exist) {
                let section = await this.sectionRepo.find({ code: criteria.section })
                let cri = new Criteria()
                cri.name = criteria.name
                cri.code = criteria.code
                cri.section = section[0]
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
            let exist = await this.questionRepo.find({code: question.code})
            if (exist.length === 0){
                let criteria = await this.criteriaRepo.find({code: question.criteria})
                let q = new CMQuestion()
                q.label = question.label
                q.code = question.code
                q.order = question.order
                q.answer_type = question.answer_type
                q.criteria = criteria[0]

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
}