export class ManageTags {
    status: boolean;
    totalCount:number;
    vendorTags: Tags[] = [];  
}

export class Tags {
    _id: string;
    name: string;
    vendorId: string;
}

export class discountCodes {
    status: boolean;
    totalCount:number;
    discountCodes: string;
}

export class Codes {
    status: string;
    discountCodes: {
        _id: string;
        status: string;
        name: string;
        description: string;
        code: string;
        startDate: string;
        endDate: string;
        offerPercentage: string;
        venueId: string;
        maximumLimit: string;
        minimumOrderAmount: string;
    }
}
