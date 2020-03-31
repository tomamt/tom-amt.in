export class venues {
    status: boolean;
    totalCount: number;
    venues: venue[] = [];
}

export class venue {
    status: boolean;
    venues: venuedetails; 
}

export class venuedetails {
    status: boolean;
    _id: string;
    type: string;
    name: string;
    email: string;
    currency: string;
    currencySymbol: string;
    address: string;   
}

