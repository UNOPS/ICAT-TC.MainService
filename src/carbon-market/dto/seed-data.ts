import { AnswerType } from "../enum/answer-type.enum"

export const sections = [
    {
        name: 'Section 2: Environmental integrity preconditions',
        code: 'SECTION_2',
        order: 1,
        description: 'The next set of questions will be related to basic tenets of environmental integrity which are preconditions for delivering transformational change and should be applied in all activities. These criteria can be considered preconditions to enable transformational impacts and should be fulfilled before assessing transformational change criteria.'
    },
    {
        name: 'Section 3: Transformational change criteria',
        code: 'SECTION_3',
        order: 2,
        description: 'This section will examine the potential of the project to contribute to fundamental, sustained change. Questions in this section will be weighted and form the overall transformational change score'
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
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        message: 'The activity is not additional, will result in “hot air” and undermine the country’s NDC, clearly not enabling transformational change'
    },
    {
        label: 'Q2: Is the Article 6 activity financially additional?',
        code: 'S-2-C-1-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        message: 'The activity cannot be considered additional, clearly not enabling transformational change.'
    },
    {
        label: 'Q3: Does the envisaged Article 6 activity occur entirely outside the scope of the country’s NDC, meaning both its conditional and unconditional NDC targets? ',
        code: 'S-2-C-1-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        message: 'Authorising mitigation outcomes of such an Article 6 activity would move a host country further from achieving its NDC targets, thus creating a high risk of compromising its goal. Therefore, such an activity does not enable transformational change.'
    },
    {
        label: 'Q4: Does the envisaged Article 6 activity involve emission reductions or removals that are not included in the GHG inventory used to assess unconditional NDC progress?',
        code: 'S-2-C-1-Q-4',
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        message: 'Authorising mitigation outcomes of such an Article 6 activity would move a host country further from achieving its NDC targets, thus creating a high risk of compromising its goal. Therefore, such an activity does not enable transformational change.'
    },
    {
        label: 'Q5: Does the envisaged Article 6 activity contribute to increased ambition by going beyond the host country’s unconditional NDC target(s), contributing to the conditional NDC target? ',
        code: 'S-2-C-1-Q-5',
        answer_type: AnswerType.SINGLE,
        order: 5,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        message: 'The envisaged Article 6 activity might not go beyond reasonably anticipated measures and thus not contribute to increased ambition.'
    },
    {
        label: 'Q6: Does the Article 6 activity feature on the host country’s positive list or has the host country stated its intention to promote the envisaged activity type?',
        code: 'S-2-C-1-Q-6',
        answer_type: AnswerType.SINGLE,
        order: 6,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        message: 'Article 6 activity should not be implemented, as it undermines transformational change, and the host country should be reached out to for a better understanding of which activities are needed for the achievement of its (unconditional) NDC targets and should therefore not be supported by carbon finance. Therefore, such an activity does not enable transformational change.'
    },
    {
        label: 'Q1: Is the activity listed on any negative list adopted by the host country? ',
        code: 'S-2-C-2-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-2-CRITERIA-2',
        characteristic: '',
        message: 'Article 6 activity should not be implemented, as it undermines transformational change.'
    },
    {
        label: 'Q2: Is the activity in line with the host country’s scenarios of its long-term low-emission development strategy (LT-LEDS) (if available), or in case an LT-LEDS is not available, can it be ensured that the activity does not lead to a lock-in of current emission levels or continuation of emissions intensive practices by prolonging the lifetime of installations using emissions technologies or by constructing new installations using emissions intensive technologies? ',
        code: 'S-2-C-2-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-2-CRITERIA-2',
        characteristic: '',
        message: 'The Article 6 activity should not be implemented, as it cannot be ensured that emissions lock-in is avoided.'
    },
    {
        label: 'Q1: Does the implementation of the Article 6 activity result in any negative environmental impacts (i.e., release of pollutants or unmanaged waste, increased GHG emissions, introduction of genetically modified organisms, etc.)?  ',
        code: 'S-2-C-3-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-2-CRITERIA-3',
        characteristic: '',
        message: 'Article 6 activity should not be implemented, as it undermines transformational change.'
    },
    {
        label: 'Q2: Does the implementation of the Article 6 activity result in any negative social impacts (i.e. displacement, forced evictions, violation of rights of indigenous people and local communities, damage or alteration of cultural heritage sites, etc.)? ',
        code: 'S-2-C-3-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-2-CRITERIA-3',
        characteristic: '',
        message: 'Article 6 activity should not be implemented, as it undermines transformational change.'
    },
    {
        label: 'Q1: Does the activity design encourage market penetration / replicability of the envisaged mitigation activity, e.g., by implementing a programme across multiple geographies? ',
        code: 'S-3-C-1-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-1',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q2: Does the activity foresee the implementation of upscaled approaches, either through a programmatic or sectoral approach or implementation of a policy? ',
        code: 'S-3-C-1-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-1',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q3: Does the activity make use of smart MRV solutions with the purpose of fostering a more rapid adoption of the mitigation practice/technology due to streamlined or digitalised MRV processes? ',
        code: 'S-3-C-1-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-3-CRITERIA-1',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q1: Does the activity contribute significantly to a specific SDG (apart from SDG13 – Climate Action)? ',
        code: 'S-3-C-2-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-2',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q1: Does the activity result in its inclusion in the unconditional NDC during the next NDC revision?  ',
        code: 'S-3-C-3-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q2: Does the activity foresee the retainment by the host country of an additional share of mitigation outcomes generated by the activity? ',
        code: 'S-3-C-3-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q3: Does the activity contribute to increased ambition by limiting the crediting period below the technical lifetime of a project and counting any mitigation that occurs after the crediting period towards national targets? ',
        code: 'S-3-C-3-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q4: Does the activity contribute to increased ambition by charging a carbon credit issuance fee and using it to fund national mitigation action that contributes to national targets? ',
        code: 'S-3-C-3-Q-4',
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q1: Is the activity innovative, i.e. supports the adoption of newly emerging technologies?  ',
        code: 'S-3-C-4-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-4',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q2: Does the activity support mitigation options with high abatement costs (high-hanging fruits)? ',
        code: 'S-3-C-4-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-4',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q1: Is the activity’s crediting baseline set in an ambitious manner, i.e. below business-as-usual (BAU)? ',
        code: 'S-3-C-5-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-5',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q2: Is the activity’s baseline emission intensity reduced over time to align with the long-term temperature goal of the Paris Agreement? ',
        code: 'S-3-C-5-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-5',
        characteristic: '',
        message: ''
    },
    {
        label: 'Q1: Does the activity contribute to the dissemination of knowledge (i.e. regarding climate change impacts and policies, new technologies, etc.)? ',
        code: 'S-3-C-6-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-6',
        characteristic: '',
        message: ''
    },
    {
        label: "Is the activity innovative, i.e., supports the adoption of newly emerging technologies, i.e. technologies that have so far not commercially been applied in the country?",
        code: "S-3-R_&_D-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "R_&_D"
    },
    {
        label: "Does the activity support mitigation options with high abatement costs (high-hanging fruits)? ",
        code: "S-3-ADOPTION-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "ADOPTION"
    },
    {
        label: "Does the activity make use of low-cost yet robust MRV solutions, e.g. through digitalisation, with the purpose of fostering a more rapid adoption of the mitigation practice\/technology?",
        code: "S-3-ADOPTION-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: '',
        message: '',
        characteristic: "ADOPTION"
    },
    {
        label: "Does the activity design encourage upscaling\/ increased market penetration \/ replication of the envisaged mitigation activity, e.g., by implementing a programme across multiple geographies, introducing a policy or applying a sectoral approach?",
        code: "S-3-SCALE_UP-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "SCALE_UP"
    },
    {
        label: "Does the activity result in inclusion of activities of this type that are subject to similar conditions (resource availability, etc.) in the unconditional NDC during the next NDC revision?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC"
    },
    {
        label: "Does the activity allocate a share of mitigation outcomes generated by the activity to the host country?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC"
    },
    {
        label: "Does the activity contribute to increased ambition by limiting the crediting period to less than the technical lifetime of a project and counting any mitigation that occurs after the crediting period towards national targets?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3",
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC"
    },
    {
        label: "Does the activity contribute to increased ambition by charging a carbon credit issuance fee and using it to fund national mitigation action that contributes to national targets?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4",
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC"
    },
    {
        label: "Is the activity’s crediting baseline set in an ambitious manner, i.e., below business-as-usual (BAU)?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5",
        answer_type: AnswerType.SINGLE,
        order: 5,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC"
    },
    {
        label: "Is the activity’s baseline emission factor reduced over time to align with the long-term temperature goal of the Paris Agreement? If the baseline does not use an emission factor, are baseline emissions declining over time?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-6",
        answer_type: AnswerType.SINGLE,
        order: 6,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC"
    },
    {
        label: "Does the activity contribute to the dissemination of knowledge (i.e. regarding climate change impacts and policies, new technologies, etc.)?",
        code: "S-3-AWARENESS-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "AWARENESS"
    },

]

export const answers = [
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-1-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-1-Q-1'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-1'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-1-Q-1-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-2-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-2'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-1-Q-2'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-1-Q-2-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-3-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-1-Q-3'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-3-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-3'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-1-Q-3-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-3'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-4-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-1-Q-4'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-4-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-4'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-1-Q-4-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-4'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-5-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-5'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-5-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-1-Q-5'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-1-Q-5-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-5'
    },
    {
        label: 'Yes',
        code: 'S-2-C-1-Q-6-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-6'
    },
    {
        label: 'No',
        code: 'S-2-C-1-Q-6-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-1-Q-6'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-1-Q-6-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-1-Q-6'
    },
    {
        label: 'Yes',
        code: 'S-2-C-2-Q-1-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-2-Q-1'
    },
    {
        label: 'No',
        code: 'S-2-C-2-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-2-Q-1'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-2-Q-1-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-2-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-2-C-2-Q-2-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-2-Q-2'
    },
    {
        label: 'No',
        code: 'S-2-C-2-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-2-Q-2'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-2-Q-2-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-2-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-2-C-3-Q-1-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-3-Q-1'
    },
    {
        label: 'No',
        code: 'S-2-C-3-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-3-Q-1'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-3-Q-1-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-3-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-2-C-3-Q-2-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: 'S-2-C-3-Q-2'
    },
    {
        label: 'No',
        code: 'S-2-C-3-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-3-Q-2'
    },
    {
        label: 'Not sure',
        code: 'S-2-C-3-Q-2-A-3',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-2-C-3-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-1-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-2-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-3-A-1',
        weight: 5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-3'
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-3-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-3'
    },
    {
        label: 'No, the project does not contribute to any SDGs ',
        code: 'S-3-C-2-Q-1-A-1',
        weight: 0,
        score_portion: 1,
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
        label: 'Yes, the project makes at least minor contributions to multiple SDGs',
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
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-2-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-1-A-1',
        weight: 7.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-2-A-1',
        weight: 7.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-3-A-1',
        weight: 2.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-3'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-3-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-3'
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-4-A-1',
        weight: 2.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-4'
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-4-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-4'
    },
    {
        label: 'Yes',
        code: 'S-3-C-4-Q-1-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-4-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-4-Q-2-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-4-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-5-Q-1-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-5-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-1'
    },
    {
        label: 'Yes',
        code: 'S-3-C-5-Q-2-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-2'
    },
    {
        label: 'No',
        code: 'S-3-C-5-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-2'
    },
    {
        label: 'Yes',
        code: 'S-3-C-6-Q-1-A-1',
        weight: 5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-6-Q-1'
    },
    {
        label: 'No',
        code: 'S-3-C-6-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-6-Q-1'
    },
    {
        label: "Yes",
        code: "S-3-R_&_D-Q-1-A-1",
        weight: 10,
        score_portion: 4,
        isPassing: true,
        question: "S-3-R_&_D-Q-1"
    },
    {
        label: "No",
        code: "S-3-R_&_D-Q-1-A-2",
        weight: 10,
        score_portion: 0,
        isPassing: true,
        question: "S-3-R_&_D-Q-1"
    },
    {
        label: "Technology has very high abatement costs (> $100\/ton)",
        code: "S-3-ADOPTION-Q-1-A-1",
        weight: 10,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1"
    },
    {
        label: "Technology has high abatement costs (> $50\/ton)",
        code: "S-3-ADOPTION-Q-1-A-2",
        weight: 10,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1"
    },
    {
        label: "Technology has medium abatement costs (> $25\/ton)",
        code: "S-3-ADOPTION-Q-1-A-3",
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1"
    },
    {
        label: "No",
        code: "S-3-ADOPTION-Q-1-A-4",
        weight: 10,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1"
    },
    {
        label: "Yes",
        code: "S-3-ADOPTION-Q-2-A-1",
        weight: 5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ADOPTION-Q-2"
    },
    {
        label: "No",
        code: "S-3-ADOPTION-Q-2-A-2",
        weight: 5,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ADOPTION-Q-2"
    },
    {
        label: "Very strongly",
        code: "S-3-SCALE_UP-Q-1-A-1",
        weight: 10,
        score_portion: 4,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1"
    },
    {
        label: "Strongly",
        code: "S-3-SCALE_UP-Q-1-A-2",
        weight: 10,
        score_portion: 3,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1"
    },
    {
        label: "Somewhat",
        code: "S-3-SCALE_UP-Q-1-A-3",
        weight: 10,
        score_portion: 2,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1"
    },
    {
        label: "Weakly",
        code: "S-3-SCALE_UP-Q-1-A-4",
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1"
    },
    {
        label: "No",
        code: "S-3-SCALE_UP-Q-1-A-5",
        weight: 10,
        score_portion: 0,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1"
    },
    {
        label: "Fully",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-1",
        weight: 7.5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1"
    },
    {
        label: "Partially",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-2",
        weight: 7.5,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1"
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-3",
        weight: 7.5,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1"
    },
    {
        label: "High (over 50% of the mitigation volume)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-1",
        weight: 7.5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2"
    },
    {
        label: " Medium (25-50% of the mitigation volume)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-2",
        weight: 7.5,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2"
    },
    {
        label: "Low (below 25% of the mitigation volume)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-3",
        weight: 7.5,
        score_portion: 1,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2"
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-4",
        weight: 7.5,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2"
    },
    {
        label: "Less than a fourth of the technical lifetime",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-1",
        weight: 2.5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3"
    },
    {
        label: "Less than half of the technical lifetime",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-2",
        weight: 2.5,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3"
    },
    {
        label: "More than half of the technical lifetime",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-3",
        weight: 2.5,
        score_portion: 1,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3"
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-4",
        weight: 2.5,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3"
    },
    {
        label: "High fee (> $5\/credit)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4-A-1",
        weight: 2.5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-4"
    },
    {
        label: "Low fee (below $5\/credit)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4-A-2",
        weight: 2.5,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-4"
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4-A-3",
        weight: 2.5,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-4"
    },
    {
        label: "Strongly",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5-A-1",
        weight: 10,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-5"
    },
    {
        label: "Somewhat (more than 5% below BAU)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5-A-2",
        weight: 10,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-5"
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5-A-3",
        weight: 10,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-5"
    },
    {
        label: "Fully aligned (baseline reaches zero in year of net zero target of host country)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-6-A-1",
        weight: 10,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-6"
    },
    {
        label: "Partially aligned",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-6-A-2",
        weight: 10,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-6"
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-6-A-3",
        weight: 10,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-6"
    },
    {
        label: "Yes",
        code: "S-3-AWARENESS-Q-1-A-1",
        weight: 5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-AWARENESS-Q-1"
    },
    {
        label: "No",
        code: "S-3-AWARENESS-Q-1-A-2",
        weight: 5,
        score_portion: 0,
        isPassing: true,
        question: "S-3-AWARENESS-Q-1"
    }
]

export const characteristic = [
    {
        name: 'Research and Development',
        code: 'R_&_D'
    },
    {
        name: 'Adoption',
        code: 'ADOPTION'
    },
    {
        name: 'Scale up',
        code: 'SCALE_UP'
    },
    {
        name: 'Entrepreneurs',
        code: 'ENTREPRENEURS'
    },
    {
        name: 'Coalition of advocates',
        code: 'COALITION_OF_ADVOCATES'
    },
    {
        name: 'Beneficiaries',
        code: 'BENIFICIARIES'
    },
    {
        name: 'Economic and non-economic',
        code: 'ECONOMIC_NON_ECONOMIC'
    },
    {
        name: 'Disincentives',
        code: 'DISINCENTIVES'
    },
    {
        name: 'Institutional and regulatory',
        code: 'INSTITUTIONAL_AND_REGULATORY'
    },
    {
        name: 'Awareness',
        code: 'AWARENESS'
    },
    {
        name: 'Behaviour',
        code: 'BEHAVIOUR'
    },
    {
        name: 'Social Norms',
        code: 'SOCIAL_NORMS'
    },
    {
        name: 'Macro Level',
        code: 'MACRO_LEVEL'
    },
    {
        name: 'Medium Level',
        code: 'MEDIUM_LEVEL'
    },
    {
        name: 'Micro Level',
        code: 'MICRO_LEVEL'
    },
    {
        name: 'Macro Level',
        code: 'MACRO_LEVEL'
    },
    {
        name: 'Medium Level',
        code: 'MEDIUM_LEVEL'
    },
    {
        name: 'Micro Level',
        code: 'MICRO_LEVEL'
    },
    {
        name: 'Long term (>15 years)',
        code: 'LONG_TERM'
    },
    {
        name: 'Medium term (5-15 years)',
        code: 'MEDIUM_TERM'
    },
    {
        name: 'Short Term (<5 years)',
        code: 'SHORT_TERM'
    },
    {
        name: 'Long term (>15 years)',
        code: 'LONG_TERM'
    },
    {
        name: 'Medium term (5-15 years)',
        code: 'MEDIUM_TERM'
    },
    {
        name: 'Short Term (<5 years)',
        code: 'SHORT_TERM'
    }
]

export const categories = [
    {
        name: 'Technology',
        code: 'TECHNOLOGY'
    },
    {
        name: 'Agents',
        code: 'AGENTS'
    },
    {
        name: 'Incentives',
        code: 'INCENTIVES'
    },
    {
        name: 'Norms',
        code: 'NORMS'
    },
    {
        name: 'Scale GHGs',
        code: 'SCALE_GHG'
    },
    {
        name: 'Scale SD',
        code: 'SCALE_SD'
    },
    {
        name: 'Sustained nature-GHGs',
        code: 'SUSTAINED_GHG'
    },
    {
        name: 'Sustained nature-SD',
        code: 'SUSTAINED_SD'
    },
]