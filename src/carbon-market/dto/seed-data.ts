import { AnswerType } from "../enum/answer-type.enum"

export const sections = [
    {
        name: 'Section 2: Environmental and social integrity preconditions',
        code: 'SECTION_2',
        order: 1,
        description: 'These questions check basic aspects of environmental integrity which are preconditions for delivering transformational change, and should be present in all interventions. They can be considered preconditions to enable transformational impacts of carbon market interventions, and thus need to be fulfilled before transformational change criteria can be assessed.',
        isUpdate: false
    },
    {
        name: 'Section 3: Transformational Change Indicators',
        code: 'SECTION_3',
        order: 2,
        description: 'This section of the carbon markets tool will examine the potential of the intervention to contribute to fundamental, sustained change. The 2021 ‘Promoting transformational change through carbon markets’ report builds on the original ICAT Transformational Change Assessment Methodology  and defines four main drivers of change: 1) technology change, 2) agents of change, 3) incentives for change, and 4) norms and behavioral change, which are operationalized in form of indicators from the responses to the following questions. Indicators from responses to questions in this section will be weighted and form the overall transformational change score.',
        isUpdate: false
    }
]

export const criterias = [
    //section 2
    {
        name: 'Criterion 1: Safeguards for environmental integrity',
        code: 'S-2-CRITERIA-1',
        order: 1,
        section: 'SECTION_2',
        isUpdate: true
    },
    {
        name: 'Criterion 2: Prevention of GHG emissions lock-in',
        code: 'S-2-CRITERIA-2',
        order: 2,
        section: 'SECTION_2',
        isUpdate: false
    },
    {
        name: 'Criterion 3: Prevention/avoidance of negative environmental and social impacts',
        code: 'S-2-CRITERIA-3',
        order: 3,
        section: 'SECTION_2',
        isUpdate: false
    },
    {
        name: 'Criterion 1: Contribution to the rapid adoption of the mitigation practice/technology',
        code: 'S-3-CRITERIA-1',
        order: 1,
        section: 'SECTION_3',
        isUpdate: false
    },
    {
        name: 'Criterion 2: Contribution to the UN’s Sustainable Development Goals (SDGs)',
        code: 'S-3-CRITERIA-2',
        order: 2,
        section: 'SECTION_3',
        isUpdate: false
    },
    {
        name: 'Criterion 3: Direct contribution to host country ambition and benefits',
        code: 'S-3-CRITERIA-3',
        order: 3,
        section: 'SECTION_3',
        isUpdate: false
    },
    {
        name: 'Criterion 4: Promotion of technology change',
        code: 'S-3-CRITERIA-4',
        order: 4,
        section: 'SECTION_3',
        isUpdate: false
    },
    {
        name: 'Criterion 5: Alignment of activity with the Paris Agreement’s long-term goal',
        code: 'S-3-CRITERIA-5',
        order: 5,
        section: 'SECTION_3',
        isUpdate: false
    },
    {
        name: 'Criterion 6: Contribution to knowledge dissemination ',
        code: 'S-3-CRITERIA-6',
        order: 6,
        section: 'SECTION_3',
        isUpdate: false
    }
]

export const questions = [
    {
        label: "Q1: Is the carbon market intervention directly mandated by law or otherwise triggered by legal requirements (e.g., regulatory documents such as ordinances and decrees)?",
        code: "S-2-C-1-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: "S-2-CRITERIA-1",
        characteristic: "",
        short_label: 'Regulatory additionality',
        message: "The intervention is not additional, will result in “hot air” and undermine the host country’s NDC, clearly not enabling transformational change. \"Hot air\" occurs when an activity’s emission goal is more lenient than its actual business-as-usual (BAU) trajectory. The simplest method to create \"hot air\" is by overestimating the BAU. The activity does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        description: 'An intervention that is to be credited through carbon market instruments needs to demonstrate regulatory additionality, meaning that it goes beyond existing and firmly scheduled legal requirements.',
        isUpdate: true
    },
    {
        label: "Q2: Has the carbon market intervention successfully demonstrated financial additionality or convincingly specified prohibitive barriers to its implementation and how these are overcome by the intervention?",
        code: "S-2-C-1-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: "S-2-CRITERIA-1",
        characteristic: "",
        short_label: 'Financial additionality',
        message: "The intervention cannot be considered additional, clearly not enabling transformational change. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        description: "A financial additionality test, meaning an investment analysis (e.g. simple cost analysis, investment comparison, benchmark analysis) is conducted to show that the intervention is not financially viable without the expected revenues from the sale of the mitigation outcomes. A barrier test is conducted to corroborate the barriers that prevent the implementation of the activity (e.g., investment barrier, technological barriers).",
        isUpdate: true
    },
    {
        label: "Q3: This only applies to interventions generating Internationally Transferred Mitigation Outcomes (ITMOs): Does the envisaged carbon market intervention go beyond (exceed) the host country's unconditional Nationally Determined Contribution (NDC) targets?",
        code: "S-2-C-1-Q-3",
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: "S-2-CRITERIA-1",
        characteristic: "",
        short_label: 'For ITMOs: NDC alignment',
        message: "The envisaged Article 6 intervention might not go beyond reasonably anticipated measures and thus not contribute to increased ambition. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        description: "ITMOs are mitigation outcomes authorised for use towards NDCs or other international mitigation purposes (e.g. CORSIA, voluntary carbon market) according to the Article 6.2 guidance. <br>Please note that not every country clearly distinguishes between unconditional and conditional NDC targets. Conditional is thereby referring to those NDC targets whose achievement is subject to international support. If the respective country has differentiated NDC targets, the Article 6 activity should go beyond its unconditional target (i.e. conditional NDC, outside of NDC)",
        isUpdate: true
    },
    {
        label: "Q4: Does the carbon market intervention robustly quantify and verify mitigation outcomes by disclosing underlying assumptions and considering uncertainty?",
        code: "S-2-C-1-Q-4",
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: "S-2-CRITERIA-1",
        characteristic: "",
        short_label: 'Robust quantification and verification of mitigation outcomes',
        message: "The envisaged intervention might overestimate the impact of the activity, undermining environmental integrity. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        description: 'Using a frequently applied and revised carbon market methodology would usually allow to answer this question with “yes”. If the methodology is new or has not been approved, please consider its specific characteristics',
        related_questions: ['S-2-C-1-Q-4', 'S-2-C-1-Q-5', 'S-2-C-1-Q-6', 'S-2-C-1-Q-7'],
        isUpdate: true
    },
    {
        label: 'Q5: Does the carbon market intervention robustly quantify and verify mitigation outcomes by setting a realistic, credible, and conservative baseline (below business-as-usual (BAU))?',
        code: 'S-2-C-1-Q-5',
        answer_type: AnswerType.SINGLE,
        order: 5,
        criteria: "S-2-CRITERIA-1",
        characteristic: '',
        short_label: '',
        message: 'The envisaged intervention might overestimate the impact of the activity, undermining environmental integrity. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.',
        description: 'A BAU baseline represents a plausible scenario for GHG emissions in the absence of the implementation of the carbon market intervention.',
        isUpdate: true
    },
    {
        label: 'Q6: Does the carbon market intervention robustly quantify and verify mitigation outcomes by ensuring conservativeness of parameters, default values and the overall quantification methodologies?',
        code: 'S-2-C-1-Q-6',
        answer_type: AnswerType.SINGLE,
        order: 6,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        short_label: '',
        message: 'The envisaged intervention might overestimate the impact of the activity, undermining environmental integrity. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.',
        isUpdate: false
    },
    {
        label: 'Q7: Does the carbon market intervention robustly quantify and verify mitigation outcomes by addressing and minimising leakage?',
        code: 'S-2-C-1-Q-7',
        answer_type: AnswerType.SINGLE,
        order: 7,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        short_label: '',
        message: 'The envisaged intervention might overestimate the impact of the activity, undermining environmental integrity. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.',
        description: 'Leakage refers to the unintended rise of GHG emissions attributable to the mitigation intervention outside of its boundaries. For example, emissions are shifted to locations that are not targeted by the mitigation intervention such as the shift of agricultural practices from areas to be afforested to others.',
        isUpdate: true
    },
    {
        label: 'Q8: This only applies to carbon market interventions that involve carbon storage (compared to the baseline): Does the carbon market intervention design aim to minimise the risk of non-permanence and does the intervention foresee the full addressing of reversals of emission reductions and removals if these occur?',
        code: 'S-2-C-1-Q-8',
        answer_type: AnswerType.SINGLE,
        order: 8,
        criteria: 'S-2-CRITERIA-1',
        characteristic: '',
        short_label: 'Minimising non-permanance and addressing reversals in full',
        message: 'The envisaged intervention might lead to a reversal in emission reductions, undermining environmental integrity. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.',
        description: 'Permanence denotes a state wherein the mitigation outcomes generated by a mitigation intervention are not reversed over time. In cases where there is a risk of reversal, the non-permanence of mitigation outcome must be approached with diligence, incorporating robust measures such as insurances, buffer pools, liability rules etc.',
        isUpdate: true
    },
    {
        label: "Q1: Is the intervention type listed on any negative list of activities that could lead to lock in (e.g., developed by the host country, the Article 6.4 Supervisory Body, the <a href=\"https://icvcm.org/wp-content/uploads/2024/02/CCP-Section-4-V2-FINAL-6Feb24.pdf\" target=\"_blank\">Integrity Council for the Voluntary Carbon Market</a>, the International Energy Agency etc.)? ",
        code: "S-2-C-2-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: "S-2-CRITERIA-2",
        characteristic: "",
        short_label: 'Intervention does not appear on a negative list',
        message: "The intervention should not be implemented, as it potentially leads to GHG emissions lock-in and undermines transformational change. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        isUpdate: true
    },
    {
        label: "Q2: Is the carbon market intervention in line with the host country’s scenarios of its long-term low-emission development strategy (LT-LEDS) (if available), or in case an LT-LEDS is not available, can it be ensured that the intervention does not lead to a lock-in of current emission levels or continuation of emissions intensive practices by prolonging the lifetime of installations using emissions-intensive technologies or by constructing new installations using emissions intensive technologies?",
        code: "S-2-C-2-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: "S-2-CRITERIA-2",
        characteristic: "",
        short_label: 'Alignment with long-term low-emission development strategy',
        message: "The intervention should not be implemented, as it potentially leads to GHG emissions lock-in and undermines transformational change. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        description: 'Emissions intensive practice or technology refers to a practice or technology with a GHG emissions intensity per unit of production/consumption surpassing the intensity of the lowest emitting, technically feasible and commercially available production pathway for the delivered product, service or output.',
        isUpdate: true
    },
    {
        label: "Q1: Does the implementation of the carbon market intervention result in significant negative environmental impacts (i.e., air, water and soil pollution, destruction of biodiversity, etc.)? (“Significant” means a material change of more than 5% of the baseline value of pollution load or biodiversity parameters in the intervention area.)",
        code: "S-2-C-3-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: "S-2-CRITERIA-3",
        characteristic: "",
        short_label: 'Prevention/avoidance of negative environmental impacts',
        message: "If the intervention entails significant negative impacts, it does not enable transformational change. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        isUpdate: false
    },
    {
        label: "Q2: Does the implementation of the carbon market intervention result in any significant negative social impacts (i.e., displacement, forced evictions, violation of rights of indigenous people and local communities, job losses, income losses, damage or alteration of cultural heritage sites, etc.)?",
        code: "S-2-C-3-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: "S-2-CRITERIA-3",
        characteristic: "",
        short_label: 'Prevention/avoidance of negative social impacts',
        message: "If the intervention entails significant negative impacts, it does not enable transformational change. The intervention does not meet the integrity preconditions and will not be eligible for a transformational change score.",
        isUpdate: true
    },
    {
        label: 'Q1: Does the activity design encourage market penetration / replicability of the envisaged mitigation activity, e.g., by implementing a programme across multiple geographies? ',
        code: 'S-3-C-1-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-1',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q2: Does the activity foresee the implementation of upscaled approaches, either through a programmatic or sectoral approach or implementation of a policy? ',
        code: 'S-3-C-1-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-1',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q3: Does the activity make use of smart MRV solutions with the purpose of fostering a more rapid adoption of the mitigation practice/technology due to streamlined or digitalised MRV processes? ',
        code: 'S-3-C-1-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-3-CRITERIA-1',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q1: Does the activity contribute significantly to a specific SDG (apart from SDG13 – Climate Action)? ',
        code: 'S-3-C-2-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-2',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q1: Does the activity result in its inclusion in the unconditional NDC during the next NDC revision?  ',
        code: 'S-3-C-3-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q2: Does the activity foresee the retainment by the host country of an additional share of mitigation outcomes generated by the activity? ',
        code: 'S-3-C-3-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q3: Does the activity contribute to increased ambition by limiting the crediting period below the technical lifetime of a project and counting any mitigation that occurs after the crediting period towards national targets? ',
        code: 'S-3-C-3-Q-3',
        answer_type: AnswerType.SINGLE,
        order: 3,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q4: Does the activity contribute to increased ambition by charging a carbon credit issuance fee and using it to fund national mitigation action that contributes to national targets? ',
        code: 'S-3-C-3-Q-4',
        answer_type: AnswerType.SINGLE,
        order: 4,
        criteria: 'S-3-CRITERIA-3',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q1: Is the activity innovative, i.e. supports the adoption of newly emerging technologies?  ',
        code: 'S-3-C-4-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-4',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q2: Does the activity support mitigation options with high abatement costs (high-hanging fruits)? ',
        code: 'S-3-C-4-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-4',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q1: Is the activity’s crediting baseline set in an ambitious manner, i.e. below business-as-usual (BAU)? ',
        code: 'S-3-C-5-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-5',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q2: Is the activity’s baseline emission intensity reduced over time to align with the long-term temperature goal of the Paris Agreement? ',
        code: 'S-3-C-5-Q-2',
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: 'S-3-CRITERIA-5',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: 'Q1: Does the activity contribute to the dissemination of knowledge (i.e. regarding climate change impacts and policies, new technologies, etc.)? ',
        code: 'S-3-C-6-Q-1',
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: 'S-3-CRITERIA-6',
        characteristic: '',
        short_label: '',
        message: '',
        isUpdate: false
    },
    {
        label: "Is the intervention innovative, i.e., supports the adoption of newly emerging technologies, i.e. technologies that have so far not commercially been applied in the country?",
        code: "S-3-R_&_D-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "R_&_D",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention support mitigation options with high abatement costs (high-hanging fruits)? ",
        code: "S-3-ADOPTION-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "ADOPTION",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention support mitigation options that are hard to reach as they face real barriers to adoption other than cost (high-hanging fruits)? ",
        code: "S-3-ADOPTION-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: '',
        message: '',
        characteristic: "ADOPTION",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention design encourage upscaling\/ increased market penetration \/ replication of the envisaged mitigation intervention, e.g., by implementing a programme across multiple geographies?",
        code: "S-3-SCALE_UP-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "SCALE_UP",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention make use of low-cost yet robust MRV solutions, e.g. through digitalisation, with the purpose of fostering a more rapid adoption of the mitigation practice\/technology?",
        code: "S-3-SCALE_UP-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: '',
        message: '',
        characteristic: "SCALE_UP",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention incentivize entrepreneurs, businesses and investors to catalyse transformational change (for example, by formulating new solutions or developing new technologies)?",
        code: "S-3-ENTREPRENEURS-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "ENTREPRENEURS",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention support coalitions and networks that seek to broaden and deepen support for low-carbon development (i.e., by promoting acceptance of new technologies or norms, ensuring uptake, etc.)?",
        code: "S-3-COALITION_OF_ADVOCATES-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "COALITION_OF_ADVOCATES",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention support diverse groups of society affected by the transformational change (i.e. those who are expected to promote and apply the skills for transformational change and make future decisions leading to a low carbon and sustainable development and lifestyles)?",
        code: "S-3-BENIFICIARIES-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "BENIFICIARIES",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention allocate a share of mitigation outcomes generated by the intervention to the host country?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention contribute to increased ambition by limiting the crediting period to less than the technical lifetime of a project and counting any mitigation that occurs after the crediting period towards national targets?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2",
        answer_type: AnswerType.SINGLE,
        order: 2,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Is the intervention’s baseline emission factor reduced over time to align with the long-term temperature goal of the Paris Agreement? If the baseline does not use an emission factor, are baseline emissions declining over time?",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5",
        answer_type: AnswerType.SINGLE,
        order: 5,
        criteria: '',
        message: '',
        characteristic: "ECONOMIC_NON_ECONOMIC",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention disincentivize technologies and business contributing to a high carbon economy (e.g. activities focused on accelerating coal phaseout)?",
        code: "S-3-DISINCENTIVES-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "DISINCENTIVES",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the carbon market intervention introduce new (parts of) regulation favouring low-carbon development (e.g. adoption of feed-in-tariffs for renewable electricity)?",
        code: "S-3-INSTITUTIONAL_AND_REGULATORY-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "INSTITUTIONAL_AND_REGULATORY",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention contribute to increased public awareness on the necessity to switch to low-carbon technologies (i.e. participation in workshops, information campaigns)?",
        code: "S-3-AWARENESS-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "AWARENESS",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the policy support measures that discourage high-carbon lifestyle and practices and promote low-carbon solutions (i.e. by introducing new practices such as improved cookstoves or land management practices)?",
        code: "S-3-BEHAVIOUR-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "BEHAVIOUR",
        short_label: '',
        isUpdate: false
    },
    {
        label: "Does the intervention affect norms within society that align with and further promote low-carbon and sustainable development (e.g. by normalizing desirable practices such as more sustainable modes of transit)?",
        code: "S-3-SOCIAL_NORMS-Q-1",
        answer_type: AnswerType.SINGLE,
        order: 1,
        criteria: '',
        message: '',
        characteristic: "SOCIAL_NORMS",
        short_label: '',
        isUpdate: false
    },

]

export const answers = [
    {
        label: "Yes",
        code: "S-2-C-1-Q-1-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-1-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-1",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-1-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-2-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-2",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-2-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-2",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-2-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-2",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-3-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-3",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-3-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-3",
        isUpdate: false
    },
    {
        label: "This does not apply",
        code: "S-2-C-1-Q-3-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-3",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-3-A-4",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-3",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-4-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-4",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-4-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-4",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-4-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-4",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-5-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-5",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-5-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-5",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-5-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-5",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-6-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-6",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-6-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-6",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-6-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-6",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-7-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-7",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-7-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-7",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-7-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-7",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-1-Q-8-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-8",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-1-Q-8-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-1-Q-8",
        isUpdate: false
    },
    {
        label: "Not relevant",
        code: "S-2-C-1-Q-8-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-8",
        isUpdate: true
    },
    {
        label: "Unsure",
        code: "S-2-C-1-Q-8-A-4",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-1-Q-8",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-2-Q-1-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-2-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-2-Q-1-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-2-Q-1",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-2-Q-1-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-2-Q-1",
        isUpdate: false
    },
    {
        label: "No negative list available",
        code: "S-2-C-2-Q-1-A-4",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-2-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-2-Q-2-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-2-Q-2",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-2-Q-2-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-2-Q-2",
        isUpdate: false
    },
    {
        label: "No LT-LEDS available",
        code: "S-2-C-2-Q-2-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-2-Q-2",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-2-Q-2-A-4",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-2-Q-2",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-3-Q-1-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-3-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-3-Q-1-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-3-Q-1",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-3-Q-1-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-3-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-2-C-3-Q-2-A-1",
        weight: 0,
        score_portion: 1,
        isPassing: false,
        question: "S-2-C-3-Q-2",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-2-C-3-Q-2-A-2",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-3-Q-2",
        isUpdate: false
    },
    {
        label: "Unsure",
        code: "S-2-C-3-Q-2-A-3",
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: "S-2-C-3-Q-2",
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-1-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-1',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-2-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-2',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-2',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-1-Q-3-A-1',
        weight: 5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-3',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-1-Q-3-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-1-Q-3',
        isUpdate: false
    },
    {
        label: 'No, the project does not contribute to any SDGs ',
        code: 'S-3-C-2-Q-1-A-1',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-2-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes, the project contributes significantly to at least 1 SDG',
        code: 'S-3-C-2-Q-1-A-2',
        weight: 10,
        score_portion: 75,
        isPassing: true,
        question: 'S-3-C-2-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes, the project makes at least minor contributions to multiple SDGs',
        code: 'S-3-C-2-Q-1-A-3',
        weight: 10,
        score_portion: 50,
        isPassing: true,
        question: 'S-3-C-2-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes, the project makes significant contributions to multiple SDGs ',
        code: 'S-3-C-2-Q-1-A-4',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-2-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-1-A-1',
        weight: 7.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-1',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-2-A-1',
        weight: 7.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-2',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-2',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-3-A-1',
        weight: 2.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-3',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-3-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-3',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-3-Q-4-A-1',
        weight: 2.5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-4',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-3-Q-4-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-3-Q-4',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-4-Q-1-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-1',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-4-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-4-Q-2-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-2',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-4-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-4-Q-2',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-5-Q-1-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-1',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-5-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-1',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-5-Q-2-A-1',
        weight: 10,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-2',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-5-Q-2-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-5-Q-2',
        isUpdate: false
    },
    {
        label: 'Yes',
        code: 'S-3-C-6-Q-1-A-1',
        weight: 5,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-6-Q-1',
        isUpdate: false
    },
    {
        label: 'No',
        code: 'S-3-C-6-Q-1-A-2',
        weight: 0,
        score_portion: 1,
        isPassing: true,
        question: 'S-3-C-6-Q-1',
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-R_&_D-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-R_&_D-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-R_&_D-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-R_&_D-Q-1",
        isUpdate: false
    },
    {
        label: "Technology has very high abatement costs (> $100\/ton)",
        code: "S-3-ADOPTION-Q-1-A-1",
        weight: 45,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1",
        isUpdate: false
    },
    {
        label: "Technology has high abatement costs (> $50\/ton)",
        code: "S-3-ADOPTION-Q-1-A-2",
        weight: 45,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1",
        isUpdate: false
    },
    {
        label: "Technology has medium abatement costs (> $25\/ton)",
        code: "S-3-ADOPTION-Q-1-A-3",
        weight: 45,
        score_portion: 1,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ADOPTION-Q-1-A-4",
        weight: 45,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ADOPTION-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-ADOPTION-Q-2-A-1",
        weight: 45,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ADOPTION-Q-2",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ADOPTION-Q-2-A-2",
        weight: 45,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ADOPTION-Q-2",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-SCALE_UP-Q-2-A-1",
        weight: 10,
        score_portion: 4,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-2",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-SCALE_UP-Q-2-A-2",
        weight: 10,
        score_portion: 0,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-2",
        isUpdate: false
    },
    {
        label: "Very strongly (upscaling is encouraged through a clearly replicable approach targeting more than five localities, introduction of a nationwide policy, or application of an approach covering a large sector)",
        code: "S-3-SCALE_UP-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1",
        isUpdate: false
    },
    {
        label: "Strongly (upscaling is encouraged through a clearly replicable approach targeting more than three localities, introduction of a regional policy, or application of an approach covering a medium-sized sector)",
        code: "S-3-SCALE_UP-Q-1-A-2",
        weight: 100,
        score_portion: 3,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1",
        isUpdate: false
    },
    {
        label: "Somewhat (upscaling is encouraged through a replicable approach only implemented in one locality (with the intention to expand), introduction of a local policy, or application of an approach covering a small sector)",
        code: "S-3-SCALE_UP-Q-1-A-3",
        weight: 100,
        score_portion: 2,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1",
        isUpdate: false
    },
    {
        label: "Weakly (some upscaling potential of the intervention can be seen, but no concrete plans to expand within the lifespan of the intervention)",
        code: "S-3-SCALE_UP-Q-1-A-4",
        weight: 100,
        score_portion: 1,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1",
        isUpdate: false
    },
    {
        label: "No (the intervention does not have the potential for upscaling or replication)",
        code: "S-3-SCALE_UP-Q-1-A-5",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-SCALE_UP-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-ENTREPRENEURS-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ENTREPRENEURS-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ENTREPRENEURS-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ENTREPRENEURS-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-COALITION_OF_ADVOCATES-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-COALITION_OF_ADVOCATES-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-COALITION_OF_ADVOCATES-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-COALITION_OF_ADVOCATES-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-BENIFICIARIES-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-BENIFICIARIES-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-BENIFICIARIES-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-BENIFICIARIES-Q-1",
        isUpdate: false
    },
    {
        label: "High (over 50% of the mitigation volume)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-1",
        weight: 7.5,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1",
        isUpdate: false
    },
    {
        label: " Medium (25-50% of the mitigation volume)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-2",
        weight: 24,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1",
        isUpdate: false
    },
    {
        label: "Low (below 25% of the mitigation volume)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-3",
        weight: 24,
        score_portion: 1,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-1-A-4",
        weight: 24,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-1",
        isUpdate: false
    },
    {
        label: "Less than a fourth of the technical lifetime",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-1",
        weight: 8,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2",
        isUpdate: false
    },
    {
        label: "Less than half of the technical lifetime",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-2",
        weight: 8,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2",
        isUpdate: false
    },
    {
        label: "More than half of the technical lifetime",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-3",
        weight: 8,
        score_portion: 1,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-2-A-4",
        weight: 8,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-2",
        isUpdate: false
    },
    {
        label: "High fee (> $5\/credit)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-1",
        weight: 8,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3",
        isUpdate: false
    },
    {
        label: "Low fee (below $5\/credit)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-2",
        weight: 8,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-3-A-3",
        weight: 8,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-3",
        isUpdate: false
    },
    {
        label: "Strongly",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4-A-1",
        weight: 30,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-4",
        isUpdate: false
    },
    {
        label: "Somewhat (more than 5% below BAU)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4-A-2",
        weight: 30,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-4",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-4-A-3",
        weight: 30,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-4",
        isUpdate: false
    },
    {
        label: "Fully aligned (baseline reaches zero in year of net zero target of host country)",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5-A-1",
        weight: 30,
        score_portion: 4,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-5",
        isUpdate: false
    },
    {
        label: "Partially aligned",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5-A-2",
        weight: 30,
        score_portion: 2,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-5",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-ECONOMIC_NON_ECONOMIC-Q-5-A-3",
        weight: 30,
        score_portion: 0,
        isPassing: true,
        question: "S-3-ECONOMIC_NON_ECONOMIC-Q-5",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-DISINCENTIVES-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-DISINCENTIVES-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-DISINCENTIVES-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-DISINCENTIVES-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-INSTITUTIONAL_AND_REGULATORY-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-INSTITUTIONAL_AND_REGULATORY-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-INSTITUTIONAL_AND_REGULATORY-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-INSTITUTIONAL_AND_REGULATORY-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-AWARENESS-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-AWARENESS-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-AWARENESS-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-AWARENESS-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-BEHAVIOUR-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-BEHAVIOUR-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-BEHAVIOUR-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-BEHAVIOUR-Q-1",
        isUpdate: false
    },
    {
        label: "Yes",
        code: "S-3-SOCIAL_NORMS-Q-1-A-1",
        weight: 100,
        score_portion: 4,
        isPassing: true,
        question: "S-3-SOCIAL_NORMS-Q-1",
        isUpdate: false
    },
    {
        label: "No",
        code: "S-3-SOCIAL_NORMS-Q-1-A-2",
        weight: 100,
        score_portion: 0,
        isPassing: true,
        question: "S-3-SOCIAL_NORMS-Q-1",
        isUpdate: false
    }
]

export const characteristic = [ 
    {
        name: 'Research and Development',
        code: 'R_&_D',
        category_id: 1,
        description: 'Technological research and development happens through support of science, specialization and learning. This includes actions such as direct investment in R&D, development of the knowledge/skill base, research networks and consortiums, capacity-building efforts, and experimentation.',
        main_question: 'Does the intervention support R&D for building technological capabilities favouring a low-carbon and/or a climate resilient economy?',
        weight: 20,
        isUpdate: false
    },
    {
        name: 'Adoption',
        code: 'ADOPTION',
        category_id: 1,
        description: 'Adoption of new technologies can be facilitated by pilot projects, demonstrations, experimentation and publicly or privately funded trials. Through these actions, the required skills and capacities to handle new technologies can be developed, new networks of users can be built, and the potential market for a new technology can be assessed.',
        main_question: 'Does the intervention lead to early adoption of promising low-carbon and/or climate resiliency building technologies?',
        weight: 60,
        isUpdate: false
    },
    {
        name: 'Scale up',
        code: 'SCALE_UP',
        category_id: 1,
        description: 'The widespread diffusion of a technology throughout society can be facilitated by replication, sectoral public-private networks, training workshops, business forums and the introduction of new business models able to deliver products and services at a larger scale.',
        main_question: 'Does the intervention support the scale-up and diffusion of low-carbon and/or climate resilient innovations?',
        weight: 20,
        isUpdate: true
    },
    {
        name: 'Entrepreneurs',
        code: 'ENTREPRENEURS',
        category_id: 2,
        description: 'Entrepreneurs are key agents of change that can invest, innovate and experiment with new technologies, applications or business models to drive change. They can be supported by creating an enabling environment and facilitating the exchange of information and ideas.',
        main_question: 'Does the intervention promote entrepreneurs, businesses and investors to catalyse transformational change?',
        weight: 33,
        isUpdate: true
    },
    {
        name: 'Coalition of advocates',
        code: 'COALITION_OF_ADVOCATES',
        category_id: 2,
        description: 'The process of transformational change can benefit from the participation of a wide range of stakeholders organized in different forms (e.g., coalitions, lobbys, social movements etc) representing diverse interests and which could defend the intervention and provide counterbalance those actors opposing it. The way the intervention is planned may determined the networks that may arise around it.',
        main_question: 'Does the intervention support coalitions and networks that seek to broaden and deepen support for low-carbon and/or climate resilient development?',
        weight: 33,
        isUpdate: false
    },
    {
        name: 'Beneficiaries',
        code: 'BENIFICIARIES',
        category_id: 2,
        description: 'Those stakeholders who would benefit from the intervention or who would be compensated if it has adverse effects can serve as agents of change and play a role in ensuring that the intervention is durable and gets strengthened over time.',
        main_question: 'Does the policy support diverse groups of society affected by the transformational change, which subsequently support the intervention?',
        weight: 33,
        isUpdate: false
    },
    {
        name: 'Economic and non-economic',
        code: 'ECONOMIC_NON_ECONOMIC',
        category_id: 3,
        description: 'Economic incentives may include tariff structures, access to low-cost finance, feed-in tariff policies for renewable energy, value-added and/or import duty exemptions on new technology, lowered land rates etc. Non-economic incentives may include partnerships, transitional support to communities affected by phase-out of emissions-intensive activities, giving ownership to local initiatives and communities, long-term institutional and governance support, political power and support for transition, signing memoranda of understanding, removing bureaucratic procedures.',
        main_question: 'Does the intervention use economic and/or non-economic incentives to shift technology and increase market penetration?',
        weight: 80,
        isUpdate: false
    },
    {
        name: 'Disincentives',
        code: 'DISINCENTIVES',
        category_id: 3,
        description: 'Disincentives may include taxes on carbon-intensive produces, use of market-based instruments ausch as import duties, tariff structures that discourage investments in business-as-usual technologies, reduction or phase-out of fossil fuels subsidies, increased or new fossil fuel taxes, etc.',
        main_question: 'Does the intervention disincentivize technologies and businesses contributing to a high carbon and/or climate vulnerable economy?',
        weight: 10,
        isUpdate: false
    },
    {
        name: 'Institutional and regulatory',
        code: 'INSTITUTIONAL_AND_REGULATORY',
        category_id: 3,
        description: 'An intervention may contribute to changes in the institutional and regulatory setting that facilitate/enable/promote transformational change. For instance, an intervention may lead to the creation of formal and informal institutions, new regulations or permanent budget allocation. It may also contribute to the development of intragovernmental processes for horizontal integration or multi-scale governmental processes.',
        main_question: 'Does the intervention create or reconfigure existing conditions, including availability of finance for implementation, and put in place regulation and institutions favouring low-carbon and/or climate resilient development?',
        weight: 10,
        isUpdate: false
    },
    {
        name: 'Awareness',
        code: 'AWARENESS',
        category_id: 4,
        description: 'An intervention may include components oriented to raise awareness and increase support for low-carbon solutions that may contribute to change norms and behaviors among diverse groups of stakeholders. Such a component can take the shape of campaigns and sensitization of policymakers and consumers, information dissemination within the institutions using various means etc',
        main_question: 'Does the intervention support awareness raising and education for transition towards sustainable , low-carbon and resilient systems?',
        weight: 46,
        isUpdate: false
    },
    {
        name: 'Behavior',
        code: 'BEHAVIOUR',
        category_id: 4,
        description: 'In order for transformational change to happen, a shift in the lifestyle and common practices of a large majority of the population has to take place. An intervention may influence consumers\' behavior with actions such as peak energy savings, cash incentives for using alternative transport models, rewards for recycling, etc.',
        main_question: 'Does the intervention support measures that discourage high-carbon and/or climate vulnerable lifestyles and practices, and promote low-carbon and/or climate resilient solutions?',
        weight: 27,
        isUpdate: false
    },
    {
        name: 'Social Norms',
        code: 'SOCIAL_NORMS',
        category_id: 4,
        description: 'Social norms refers to those behaviors and practices that have become widely accepted and enjoy broad and deeply entrenched support within the society. An intervention can contribute to low-carbon lifestyle and practices becoming the prevalent societal norm. Some examples of this are the willingness to pay for pollution, the valorization of natural resources, the widespread adoption of energy efficiency measures within the households, etc.',
        main_question: 'Does the intervention affect norms within society that align with and further promote low-carbon and/or climate resilient sustainable development?',
        weight: 27,
        isUpdate: false
    },
    {
        name: 'International/global levell',
        code: 'MACRO_LEVEL',
        category_id: 5,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'National/Sectoral level',
        code: 'MEDIUM_LEVEL',
        category_id: 5,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Subnational/regional/municipal or sub sectoral level',
        code: 'MICRO_LEVEL',
        category_id: 5,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'International/global level',
        code: 'MACRO_LEVEL',
        category_id: 6,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'National/Sectoral level',
        code: 'MEDIUM_LEVEL',
        category_id: 6,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Subnational/regional/municipal or sub sectoral level',
        code: 'MICRO_LEVEL',
        category_id: 6,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Long term (>15 years)',
        code: 'LONG_TERM',
        category_id: 7,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Medium term (5-15 years)',
        code: 'MEDIUM_TERM',
        category_id: 7,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Short term (<5 years)',
        code: 'SHORT_TERM',
        category_id: 7,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Long term (>15 years)',
        code: 'LONG_TERM',
        category_id: 8,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Medium term (5-15 years)',
        code: 'MEDIUM_TERM',
        category_id: 8,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Short term (<5 years)',
        code: 'SHORT_TERM',
        category_id: 8,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'International/global level',
        code: 'INTERNATIONAL',
        category_id: 9,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'National/Sectoral level',
        code: 'NATIONAL',
        category_id: 9,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Subnational/regional/municipal or sub sectoral level',
        code: 'SUBNATIONAL',
        category_id: 9,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Long term (>15 years)',
        code: 'INTERNATIONAL',
        category_id: 10,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Medium term (5-15 years)',
        code: 'NATIONAL',
        category_id: 10,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
    {
        name: 'Short term (<5 years)',
        code: 'SUBNATIONAL',
        category_id: 10,
        description: '',
        main_question: '',
        weight: 0,
        isUpdate: false
    },
]

export const categories = [
    {
        name: 'Technology',
        code: 'TECHNOLOGY',
        description: 'Process, skills and practices that drive research and development, early adoption and widespread scale-up of clean technologies.',
        weight: 30,
        isUpdate: false
    },
    {
        name: 'Agents',
        code: 'AGENTS',
        description: 'Governments, entrepreneurs, the private sector and civil society, as well as cross-cutting coalitions and networks as agents of transformational change.',
        weight: 10,
        isUpdate: true
    },
    {
        name: 'Incentives',
        code: 'INCENTIVES',
        description: 'Economic and non-economic incentives, along with disincentives, which play a critical role in shifting technology and societal change.',
        weight: 50,
        isUpdate: false
    },
    {
        name: 'Norms and behavioral change',
        code: 'NORMS',
        description: 'Include processes that influence awareness and behavior of people to drive a long-lasting change in societal norms and practices.',
        weight: 10,
        isUpdate: false
    },
    {
        name: 'GHG Scale of the Outcome',
        code: 'SCALE_GHG',
        description: '',
        weight: 35,
        isUpdate: false
    },
    {
        name: 'SDG Scale of the Outcome',
        code: 'SCALE_SD',
        description: '',
        weight: 35,
        isUpdate: false
    },
    {
        name: 'GHG Time frame over which the outcome is sustained',
        code: 'SUSTAINED_GHG',
        description: '',
        weight: 35,
        isUpdate: false
    },
    {
        name: 'SDG Time frame over which the outcome is sustained',
        code: 'SUSTAINED_SD',
        description: '',
        weight: 35,
        isUpdate: false
    },
    {
        name: 'Adaptation Scale of the Outcome',
        code: 'SCALE_ADAPTATION',
        description: '',
        weight: 30,
        isUpdate: false
    },
    {
        name: 'Adaptation Time frame over which the outcome is sustained',
        code: 'SUSTAINED_ADAPTATION',
        description: '',
        weight: 30,
        isUpdate: false
    },
]

export const defaultValues = [
    {
        category: 'SCALE_GHG',
        characteristic: 'MACRO_LEVEL',
        starting_situation_value: 59,
        expected_impact_value: 59,
        source: '',
        unit: 'GtCO2-eq',
        code: 'SCALE_GHG_MACRO_LEVEL_DEF_1'
    },
    {
        category: 'SCALE_GHG',
        characteristic: 'MEDIUM_LEVEL',
        starting_situation_value: 59,
        expected_impact_value: 59,
        source: '',
        unit: '',
        code: 'SCALE_GHG_MEDIUM_LEVEL_DEF_1'
    },
    {
        category: 'SCALE_GHG',
        characteristic: 'MICRO_LEVEL',
        starting_situation_value: 59,
        expected_impact_value: 59,
        source: '',
        unit: 'GtCO2-eq',
        code: 'SCALE_GHG_MICRO_LEVEL_DEF_1'
    },
]