import { Injectable } from "@nestjs/common";

@Injectable()
export class MasterDataService {

    private _SDGs: {id: number, name: string, code: string}[] = []
    private _tools: {id: number, name: string, code: string}[] = []

    constructor() {
        this.SDGs = [
            { id: 1, name: 'No poverty', code: 'NO_POVERTY' },
            { id: 1, name: 'Zero hunger', code: 'ZERO_HUNGER' },
            { id: 1, name: 'Good health and well-being', code: 'GOOD_HEALTH_AND_WELL_BEING' },
            { id: 1, name: 'Quality education', code: 'QULITY_EDUCATION' },
            { id: 1, name: 'Gender equality', code: 'GENDER_EQUALITY' },
            { id: 1, name: 'Clean water and sanitation', code: 'CLEAN_WATER_AND_SANITATION' },
            { id: 1, name: 'Affordable and clean energy', code: 'AFFORDABLE_AND_CLEAN_ENERGY' },
            { id: 1, name: 'Decent work and economic growth', code: 'DECENT_WORK_AND_ECONOMIC_GROWTH' },
            { id: 1, name: 'Industry innovation and infrastructure', code: 'INDUSTRY_INNOVATION_AND_INFRASTRUCTURE' },
            { id: 1, name: 'Reduced inequalities', code: 'REDUCED_INEQUALITIES' },
            { id: 1, name: 'Sustainable cities and communities', code: 'SUSTAINABLE_CITIES_AND_COMMUNIIES' },
            { id: 1, name: 'Responsible consumption and production', code: 'RESPONSIBLE_CONSUMPTION_AND_PRODUCTION' },
            { id: 1, name: 'Climate action', code: 'CLIMATE_ACTION' },
            { id: 1, name: 'Life below water', code: 'LIFE_BELOW_WATER' },
            { id: 1, name: 'Life on land', code: 'LIFE_ON_LAND' },
            { id: 1, name: 'Peace, justice and strong institutions', code: 'PEACE_JUSTICE_AND_STRING_INSTITUTIONS' },
            { id: 1, name: 'Partnerships for the goals', code: 'PARTNERSHIPS_FOR_THE_GOALS' }
        ]

        this.tools = [
            {id: 1, name: 'Other Interventions', code: 'PORTFOLIO'},
            {id: 2, name: 'Carbon Market Tool', code: 'CARBON_MARKET'},
            {id: 3, name: 'Investor & Private Sector Tool', code: 'INVESTOR'},
          ]
    }

    set SDGs(value: { id: number, name: string, code: string }[]) {
        this._SDGs = value;
    }

    get SDGs(): { id: number, name: string, code: string }[] {
        return this._SDGs;
    }

    set tools(value: { id: number; name: string; code: string }[]) {
        this._tools = value;
    }

    get tools(): { id: number; name: string; code: string }[] {
        return this._tools;
    }

    getToolName(code: string) {
        let tool = this.tools.find(o => o.code === code)
        if (tool) {
            return tool.name
        } else {
            return ''
        }
    }


}