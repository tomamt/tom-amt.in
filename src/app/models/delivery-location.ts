export class deliveryAreas {
    status: boolean;
    totalCount:number;
    deliveryAreas: deliveryArea[] = [];
}

export class deliveryArea {
    _id: string;
    name: string;
    venueId: string;
}

export class deliveryLocations {
    status: boolean;
    totalCount:number;
    deliveryLocations: deliveryArea[] = [];
}

export class agentWorkingHours {
    status: boolean;
    daWorkingHours: {
        noShowCount: string,
        totalHours: string,
        agentWorkingRes: agentWorkingHour[]
       
    }
}

export class agentWorkingHour {
    _id: string;
    clockIn: string;
    createdDate: string;
    clockOut: string;
}

export class deliveryAgents {
    status: boolean;
    deliveryAgents: deliveryAgent[] = [];
}

export class deliveryAgent {
    _id: boolean;
    phoneNumber: string;
    empId: string;
}

