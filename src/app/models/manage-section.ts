export class ManageSection {
    status: boolean;
    totalCount:number;
    vendorMenuSection: Sections[] = [];  
}

export class Sections {
    _id: string;
    name: string;
    vendorId: {_id: string};
}
