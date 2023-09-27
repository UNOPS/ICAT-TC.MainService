export class ComparisonDto {
    col_set_1: any[] = []
    col_set_2: any[] = []
    interventions: any[] = []
    characteristic_count?: number
    order?: number
    comparison_type?:string
    comparison_type_2?:string
    total?: number
    sdg_count?: number
}

export class ComparisonTableDataDto {
    process_data: ComparisonDto[]
    outcome_data: ComparisonDto[]
    aggregation_data: ComparisonDto
    alignment_data: ComparisonDto
}

