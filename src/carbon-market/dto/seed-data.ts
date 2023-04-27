import { AnswerType } from "../enum/answer-type.enum"

export const sections = [
    {
        name: 'Section 2: Environmental integrity preconditions',
        code: 'SECTION_2',
        order: 1
    },
    {
        name: 'Section 3: Transformational change criteria',
        code: 'SECTION_3',
        order: 2
    }
]

export const criterias = [
    {
        name: 'Criterion 1: Prevention/avoidance of overselling and undermining host country’s NDC',
        code: 'S-2-CRITERIA-1',
        order: 1,
        section: 'SECTION_2'
    },
    {
        name: 'Criterion 2: Prevention of GHG emissions lock-in',
        code: 'S-2-CRITERIA-2',
        order: 2,
        section: 'SECTION_2'
    },
    {
        name: 'Criterion 3: Prevention/avoidance of negative environmental and social impacts',
        code: 'S-2-CRITERIA-3',
        order: 3,
        section: 'SECTION_2'
    }
]

export const questions = [
    {
        label: 'Is the Article 6 activity directly mandated by law or otherwise triggered by legal requirements (e.g., legally binding agreements, covenants, consent decrees, contracts with government agencies and private parties)? ',
        code: 'S-2-C-1-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-2-CRITERIA-1'
    }
]