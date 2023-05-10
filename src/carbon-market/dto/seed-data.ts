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
    //section 2
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
    },
    {
        name: 'Criterion 1: Contribution to the rapid adoption of the mitigation practice/technology',
        code: 'S-3-CRITERIA-1',
        order: 1,
        section: 'SECTION_3'
    },
    {
        name: 'Criterion 2: Contribution to the UN’s Sustainable Development Goals (SDGs)',
        code: 'S-3-CRITERIA-2',
        order: 2,
        section: 'SECTION_3'
    },
    {
        name: 'Criterion 3: Direct contribution to host country ambition and benefits',
        code: 'S-3-CRITERIA-3',
        order: 3,
        section: 'SECTION_3'
    },
    {
        name: 'Criterion 4: Promotion of technology change',
        code: 'S-3-CRITERIA-4',
        order: 4,
        section: 'SECTION_3'
    },
    {
        name: 'Criterion 5: Alignment of activity with the Paris Agreement’s long-term goal',
        code: 'S-3-CRITERIA-5',
        order: 5,
        section: 'SECTION_3'
    },
    {
        name: 'Criterion 6: Contribution to knowledge dissemination ',
        code: 'S-3-CRITERIA-6',
        order: 6,
        section: 'SECTION_3'
    }
]

export const questions = [
    {
        label: 'Q1: Is the Article 6 activity directly mandated by law or otherwise triggered by legal requirements (e.g., legally binding agreements, covenants, consent decrees, contracts with government agencies and private parties)? ',
        code: 'S-2-C-1-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-2-CRITERIA-1'
    },
    {
        label: 'Q2: Is the Article 6 activity financially additional?',
        code: 'S-2-C-1-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-2-CRITERIA-1'
    },
    {
        label: 'Q3: Does the envisaged Article 6 activity occur entirely outside the scope of the country’s NDC, meaning both its conditional and unconditional NDC targets? ',
        code: 'S-2-C-1-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-2-CRITERIA-1'
    },
    {
        label: 'Q4: Does the envisaged Article 6 activity involve emission reductions or removals that are not included in the GHG inventory used to assess unconditional NDC progress?',
        code: 'S-2-C-1-Q-4',
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: 'S-2-CRITERIA-1'
    },
    {
        label: 'Q5: Does the envisaged Article 6 activity contribute to increased ambition by going beyond the host country’s unconditional NDC target(s), contributing to the conditional NDC target? ',
        code: 'S-2-C-1-Q-5',
        answer_type: AnswerType.SINGLE,
        order: 5,
        criteria: 'S-2-CRITERIA-1'
    },
    {
        label: 'Q6: Does the Article 6 activity feature on the host country’s positive list or has the host country stated its intention to promote the envisaged activity type?',
        code: 'S-2-C-1-Q-6',
        answer_type: AnswerType.SINGLE,
        order: 6,
        criteria: 'S-2-CRITERIA-1'
    },
    {
        label: 'Q1: Is the activity listed on any negative list adopted by the host country? ',
        code: 'S-2-C-2-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-2-CRITERIA-2'
    },
    {
        label: 'Q2: Is the activity in line with the host country’s scenarios of its long-term low-emission development strategy (LT-LEDS) (if available), or in case an LT-LEDS is not available, can it be ensured that the activity does not lead to a lock-in of current emission levels or continuation of emissions intensive practices by prolonging the lifetime of installations using emissions technologies or by constructing new installations using emissions intensive technologies? ',
        code: 'S-2-C-2-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-2-CRITERIA-2'
    },
    {
        label: 'Q1: Does the implementation of the Article 6 activity result in any negative environmental impacts (i.e., release of pollutants or unmanaged waste, increased GHG emissions, introduction of genetically modified organisms, etc.)?  ',
        code: 'S-2-C-3-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-2-CRITERIA-3'
    },
    {
        label: 'Q2: Does the implementation of the Article 6 activity result in any negative social impacts (i.e. displacement, forced evictions, violation of rights of indigenous people and local communities, damage or alteration of cultural heritage sites, etc.)? ',
        code: 'S-2-C-3-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-2-CRITERIA-3'
    },
    {
        label: 'Q1: Does the activity design encourage market penetration / replicability of the envisaged mitigation activity, e.g., by implementing a programme across multiple geographies? ',
        code: 'S-3-C-1-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-1'
    },
    {
        label: 'Q2: Does the activity foresee the implementation of upscaled approaches, either through a programmatic or sectoral approach or implementation of a policy? ',
        code: 'S-3-C-1-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-1'
    },
    {
        label: 'Q3: Does the activity make use of smart MRV solutions with the purpose of fostering a more rapid adoption of the mitigation practice/technology due to streamlined or digitalised MRV processes? ',
        code: 'S-3-C-1-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-3-CRITERIA-1'
    },
    {
        label: 'Q1: Does the activity contribute significantly to a specific SDG (apart from SDG13 – Climate Action)? ',
        code: 'S-3-C-2-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-2'
    },
    {
        label: 'Q1: Does the activity result in its inclusion in the unconditional NDC during the next NDC revision?  ',
        code: 'S-3-C-3-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-3'
    },
    {
        label: 'Q2: Does the activity foresee the retainment by the host country of an additional share of mitigation outcomes generated by the activity? ',
        code: 'S-3-C-3-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-3'
    },
    {
        label: 'Q3: Does the activity contribute to increased ambition by limiting the crediting period below the technical lifetime of a project and counting any mitigation that occurs after the crediting period towards national targets? ',
        code: 'S-3-C-3-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-3-CRITERIA-3'
    },
    {
        label: 'Q4: Does the activity contribute to increased ambition by charging a carbon credit issuance fee and using it to fund national mitigation action that contributes to national targets? ',
        code: 'S-3-C-3-Q-4',
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: 'S-3-CRITERIA-3'
    },
    {
        label: 'Q1: Is the activity innovative, i.e. supports the adoption of newly emerging technologies?  ',
        code: 'S-3-C-4-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-4'
    },
    {
        label: 'Q2: Does the activity support mitigation options with high abatement costs (high-hanging fruits)? ',
        code: 'S-3-C-4-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-4'
    },
    {
        label: 'Q1: Is the activity’s crediting baseline set in an ambitious manner, i.e. below business-as-usual (BAU)? ',
        code: 'S-3-C-5-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-5'
    },
    {
        label: 'Q2: Is the activity’s baseline emission intensity reduced over time to align with the long-term temperature goal of the Paris Agreement? ',
        code: 'S-3-C-5-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-5'
    },
    {
        label: 'Q1: Does the activity contribute to the dissemination of knowledge (i.e. regarding climate change impacts and policies, new technologies, etc.)? ',
        code: 'S-3-C-6-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-6'
    },
    
]

export const answers = [
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-1-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-1-Q-1'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-1-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-2-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-1-Q-2'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-1-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-3-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-1-Q-3'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-3-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-1-Q-3'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-4-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-1-Q-4'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-4-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-1-Q-4'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-5-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-1-Q-5'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-5-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-1-Q-5'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-6-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-1-Q-6'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-6-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-1-Q-6'
    },
    {
        label: 'Yes',
        code: 'S-2-C-2-Q-1-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-2-Q-1'
    },
    {
        label: 'No',
        code: 'S-2-C-2-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-2-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-2-C-2-Q-2-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-2-Q-2'
    },
    {
        label: 'No',
        code: 'S-2-C-2-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-2-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-2-C-3-Q-1-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-3-Q-1'
    },
    {
        label: 'No',
        code: 'S-2-C-3-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-3-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-2-C-3-Q-2-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: false,
        question: 'S-2-C-3-Q-2'
    },
    {
        label: 'No',
        code: 'S-2-C-3-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-2-C-3-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-1-A-1',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-1-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-1-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-2-A-1',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-1-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-1-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-3-A-1',
        weight: 5,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-1-Q-3'
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-3-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-1-Q-3'
    },
    {
        label: 'No, the project does not contribute to any SDGs ',
        code: 'S-3-C-2-Q-1-A-1',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-2-Q-1'
    },
    {
        label: 'Yes, the project contributes significantly to at least 1 SDG',
        code: 'S-3-C-2-Q-1-A-2',
        weight: 10,
        score_portion: 75,
        isPassing: true,
        question: 'S-3-C-2-Q-1'
    },
    {
        label: 'Yes, the project contributes significantly to at least 1 SDG',
        code: 'S-3-C-2-Q-1-A-3',
        weight: 10,
        score_portion: 50,
        isPassing: true,
        question: 'S-3-C-2-Q-1'
    },
    {
        label: 'Yes, the project makes significant contributions to multiple SDGs ',
        code: 'S-3-C-2-Q-1-A-4',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-2-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-1-A-1',
        weight: 7.5,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-2-A-1',
        weight: 7.5,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-3-A-1',
        weight: 2.5,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-3'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-3-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-3'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-4-A-1',
        weight: 2.5,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-4'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-4-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-3-Q-4'
    },
    {
        label: 'Yes',
        code: 'S-3-C-4-Q-1-A-1',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-4-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-4-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-4-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-4-Q-2-A-1',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-4-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-4-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-4-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-5-Q-1-A-1',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-5-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-5-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-5-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-5-Q-2-A-1',
        weight: 10,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-5-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-5-Q-2-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-5-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-6-Q-1-A-1',
        weight: 5,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-6-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-6-Q-1-A-2',
        weight: 0,
        score_portion: 100,
        isPassing: true,
        question: 'S-3-C-6-Q-1'
    },
]