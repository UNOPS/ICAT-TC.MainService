import { Injectable } from "@nestjs/common";
import { answers, categories, characteristic, criterias, defaultValues, questions, sections } from "../dto/seed-data";
import { InjectRepository } from "@nestjs/typeorm";
import { Section } from "../entity/section.entity";
import { Criteria } from "../entity/criteria.entity";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { Repository } from "typeorm";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMDefaultValue } from "../entity/cm-default-value.entity";
import { MethodologyAssessmentService } from "src/methodology-assessment/methodology-assessment.service";

@Injectable()
export class CMSeedService {

    constructor(
        @InjectRepository(Section) private sectionRepo: Repository<Section>,
        @InjectRepository(Criteria) private criteriaRepo: Repository<Criteria>,
        @InjectRepository(CMQuestion) private questionRepo: Repository<CMQuestion>,
        @InjectRepository(CMAnswer) private answerRepo: Repository<CMAnswer>,
        @InjectRepository(Characteristics) private characRepo: Repository<Characteristics>,
        @InjectRepository(Category) private catRepo: Repository<Category>,
        @InjectRepository(Assessment) private assessmentRepo: Repository<Assessment>,
        @InjectRepository(CMDefaultValue) private cmDefaultValueRepo: Repository<CMDefaultValue>,
        private methodologyAssessmentService: MethodologyAssessmentService
    ){}

    async sectionSeed(){
        let _sections: Section[] = []
        for await (let section of sections) {
            let exist = await this.sectionRepo.createQueryBuilder('se').where('se.code = :code', {code: section.code}).getMany()
            if (exist.length === 0){
                let sec = new Section();
                sec.name = section.name;
                sec.code = section.code;
                sec.order = section.order;
                sec.description = section.description;

                _sections.push(sec);
            }
        }
        if (_sections.length > 0){
            let res = this.sectionRepo.save(_sections)
            if (res) {
                return "saved";
            } else {
                return "failed to save";
            }
        } else {
            return "All the sections are saved";
        }
    }

    async criteriaSeed() {
        let _criterias: Criteria[] = []
        for await (let criteria of criterias) {
            let exist = await this.criteriaRepo.createQueryBuilder('criteria').where('code = :code', {code: criteria.code}).getOne()
            if (!exist) {
                let section = await this.sectionRepo.createQueryBuilder('se').where('se.code = :code', {code: criteria.section}).getOne()
                let cri = new Criteria();
                cri.name = criteria.name;
                cri.code = criteria.code;
                cri.section = section;
                cri.order = criteria.order;

                _criterias.push(cri);
            }
        }
        if (_criterias.length > 0) {
            let res = this.criteriaRepo.save(_criterias)
            if (res) {
                return "saved";
            } else {
                return "failed to save";
            }
        } else {
            return "All the criterias are saved";
        }
    }

    async questionSeed() {
        let _questions: CMQuestion[] = []
        for await (let question of questions){
            let exist = await this.questionRepo.createQueryBuilder('qu').where('qu.code = :code', {code: question.code}).getMany()
            if (exist.length === 0){
                let criteria = await this.criteriaRepo.createQueryBuilder('cr').where('cr.code = :code', {code: question.criteria}).getOne()
                let q = new CMQuestion();
                q.label = question.label;
                q.code = question.code;
                q.order = question.order;
                q.answer_type = question.answer_type;
                q.short_label = question.short_label;
                if (criteria !== undefined) q.criteria = criteria;
                let ch = await this.characRepo.findOne({where: {code: question.characteristic}});
                if (ch !== undefined) q.characteristic = ch;
                _questions.push(q);
            }
        }
        if (_questions.length > 0) {
            let res = this.questionRepo.save(_questions)
            if (res) {
                return "saved";
            } else {
                return "failed to save";
            }
        } else {
            return "All the questions are saved";
        }

    }

    async answerSeed() {
        let _answers: CMAnswer[] = []
        for await (let answer of answers){
            let exist = await this.answerRepo.createQueryBuilder('an').where('an.code = :code', {code: answer.code}).getMany();
            if (exist.length === 0 ){
                let question = await this.questionRepo.createQueryBuilder('qu').where('qu.code = :code', {code: answer.question}).getOne();
                let a = new CMAnswer();
                a.label = answer.label;
                a.code = answer.code;
                a.isPassing = answer.isPassing;
                a.weight = answer.weight;
                a.score_portion = answer.score_portion;
                a.question = question;

                _answers.push(a);
            }
        }
        if (_answers.length > 0) {
            let res = this.answerRepo.save(_answers);
            if (res) {
                return "saved";
            } else {
                return "failed to save";
            }
        } else {
            return "All the answers are saved";
        }
    }

    async updateQuestionSeed() {
        let response = {}
        let _questions: CMQuestion[] = []
        for await (let question of questions){
            if (question.isUpdate) {
                let q = await this.questionRepo.createQueryBuilder('qu').where('qu.code = :code', {code: question.code}).getOne();
                if (q){
                    q.message = question.message;
                    q.label = question.label;
                    q.answer_type = question.answer_type;
                    q.order = question.order;
                    q.short_label = question.short_label;
                    if (question.related_questions?.length > 0) {
                        q.related_questions = JSON.stringify(question.related_questions);
                    }
                    let ch = await this.characRepo.findOne({where: {code: question.characteristic}});
                    if (ch) q.characteristic = ch;
                    _questions.push(q);
                } else {
                    response[question.code] = 'Not found';
                }
            }
        }

        if (_questions.length > 0){
            let res = this.questionRepo.save(_questions);
            if (res) {
                return {res: response, status: "saved"};
            } else { 
                return {res: response, status: "failed to save"};
            }
        }  else {
            return {res: response, status: "Nothing to save"};
        }
        
    }

    async updateAnswerSeed() {
        let response = {}
        let _answers: CMAnswer[] = []
        for await (let ans of answers){
            if (ans.isUpdate) {
                let a = await this.answerRepo.createQueryBuilder('an').where('an.code = :code', {code: ans.code}).getOne();
                if (a){
                    a.label = ans.label;
                    a.score_portion = ans.score_portion;
                    a.weight = ans.weight;
                    a.isPassing = ans.isPassing;
                    _answers.push(a);
                } else {
                    response[ans.code] = 'Not found';
                }
            }
        }

        if (_answers.length > 0){
            let res = this.answerRepo.save(_answers);
            if (res) {
                return {res: response, status: "saved"};
            } else { 
                return {res: response, status: "failed to save"};
            }
        }  else {
            return {res: response, status: "Nothing to save"};
        }
        
    }

    async updateCharacteristicsByName() {
        let response = {}
        let _characterisctics: Characteristics[] = [];

        for await(let char of characteristic){
            if (char.isUpdate) {
                let c = await this.characRepo.createQueryBuilder('ch').where('ch.code = :name', {name: char.code}).getMany();
                if (c){
                    for await (let _c of c){
                        _c.main_question = char.main_question;;
                        _characterisctics.push(_c);;
                    }
                } else {
                    response[char.name] = 'Not found';;
                }
            }
        }

        if (_characterisctics.length > 0){
            let res = this.characRepo.save(_characterisctics)
            if (res) {
                return {res: response, status: "saved"};
            } else { 
                return {res: response, status: "failed to save"};
            }
        }  else {
            return {res: response, status: "Nothing to save"};
        }
    }

    async updateSectionSeed() {
        let response = {}
        let _sections: Section[] = []
        for await (let sec of sections){
            if (sec.isUpdate) {
                let s = await this.sectionRepo.createQueryBuilder('sc').where('sc.code = :code', {code: sec.code}).getOne()
                if (s){
                    s.name = sec.name;
                    s.description = sec.description;
                    s.order = sec.order;
                    _sections.push(s);
                } else {
                    response[sec.code] = 'Not found';
                }
            }
        }

        if (_sections.length > 0){
            let res = this.sectionRepo.save(_sections)
            if (res) {
                return {res: response, status: "saved"};
            } else { 
                return {res: response, status: "failed to save"};
            }
        }  else {
            return {res: response, status: "Nothing to save"};
        }
        
    }

    async updateCriteriaSeed() {
        let response = {}
        let _criterias: Criteria[] = [];
        for await (let criteria of criterias){
            if (criteria.isUpdate) {
                let s = await this.criteriaRepo.createQueryBuilder('cr').where('cr.code = :code', {code: criteria.code}).getOne();
                if (s){
                    s.name = criteria.name;
                    s.order = criteria.order;
                    _criterias.push(s);
                } else {
                    response[criteria.code] = 'Not found';
                }
            }
        }

        if (_criterias.length > 0){
            let res = this.criteriaRepo.save(_criterias);
            if (res) {
                return {res: response, status: "saved"};
            } else { 
                return {res: response, status: "failed to save"};
            }
        }  else {
            return {res: response, status: "Nothing to save"};
        }
        
    }

    async updateCategoryByName() {
        let response = {}
        let _categories: Category[] = []

        for await(let cat of categories){
            if (cat.isUpdate) {
                let c = await this.catRepo.createQueryBuilder('ct').where('ct.code = :name', {name: cat.code}).getMany();
                if (c){
                    for await (let _c of c){
                        _c.name = cat.name;
                        _c.description = cat.description;
                        _c.cm_weight = cat.weight;
                        _categories.push(_c);
                    }
                } else {
                    response[cat.name] = 'Not found';
                }
            }
        }

        if (_categories.length > 0){
            let res = this.catRepo.save(_categories);
            if (res) {
                return {res: response, status: "saved"};
            } else { 
                return {res: response, status: "failed to save"};
            }
        }  else {
            return {res: response, status: "Nothing to save"};
        }
    }

    async deleteNotUsingQuestions(){
        let _questions = await this.questionRepo.createQueryBuilder('q').getMany();
        let q_codes = questions.map(o => o.code);

        let qs: CMQuestion[] = []
        for await(let question of _questions){
            if (!q_codes.includes(question.code)){
                question.status = -20;
                qs.push(question);
            }
        }

        if (qs.length > 0){
            let res = this.questionRepo.save(qs)
            if (res) {
                return { status: "saved"};
            } else { 
                return { status: "failed to save"};
            }
        }  else {
            return { status: "Nothing to save"};
        }
    }

    async deleteNotUsingAnswers(){
        let _answers = await this.answerRepo.createQueryBuilder('a').getMany();
        let a_codes = answers.map(o => o.code);

        let ans: CMAnswer[] = []
        for await(let answer of _answers){
            if (!a_codes.includes(answer.code)){
                answer.status = -20;
                ans.push(answer);
            }
        }

        if (ans.length > 0){
            let res = this.answerRepo.save(ans);
            if (res) {
                return { status: "saved"};
            } else { 
                return { status: "failed to save"};
            }
        }  else {
            return { status: "Nothing to save"};
        }
    }

    async updateToolNameInAssessment(){
        let allAssessments = await this.assessmentRepo.createQueryBuilder('a').getMany()
        allAssessments = allAssessments.map(ass => {
            switch(ass.tool){
                case 'Investor & Private Sector Tool':
                    ass.tool = 'INVESTOR';
                    break;
                case 'Investment & Private Sector Tool':
                    ass.tool = 'INVESTOR';
                    break;
                case 'Carbon Market Tool':
                    ass.tool = 'CARBON_MARKET';
                    break;
                case 'Other Interventions':
                    ass.tool = 'PORTFOLIO';
                    break;
                case 'Portfolio Tool':
                    ass.tool = 'PORTFOLIO';
                    break;
            }
            return ass;
        })
        if (allAssessments.length > 0){
            let res = this.assessmentRepo.save(allAssessments)
            if (res) {
                return { status: "saved"};
            } else { 
                return { status: "failed to save"};
            }
        }  else {
            return { status: "Nothing to save"};
        }
    }

    async defaultValueSeed() {
        let _defaults: CMDefaultValue[] = []
        for await (let default_value of defaultValues){
            let exist = await this.cmDefaultValueRepo.createQueryBuilder('default').where('code = :code', {code: default_value.code}).getOne()
            if (!exist){
                let characteristic = await this.methodologyAssessmentService.findCharacteristicByCode(default_value.category, default_value.characteristic)
                let def = new CMDefaultValue();
                if (characteristic !== undefined) def.characteristic = characteristic;
                def.starting_situation_value = default_value.starting_situation_value;
                def.expected_impact_value = default_value.expected_impact_value;
                def.unit = default_value.unit;
                def.source = default_value.source;
                def.code = default_value.code;
                _defaults.push(def);
            } else {
                exist.starting_situation_value = default_value.starting_situation_value;
                exist.expected_impact_value = default_value.expected_impact_value;
                exist.source = default_value.source;
                exist.unit = default_value.unit;
                exist.code = default_value.code;
                _defaults.push(exist)
            }
        }
        if (_defaults.length > 0) {
            let res = this.cmDefaultValueRepo.save(_defaults)
            if (res) {
                return "saved";
            } else {
                return "failed to save";
            }
        } else {
            return "All the default values are saved";
        }
    }
}