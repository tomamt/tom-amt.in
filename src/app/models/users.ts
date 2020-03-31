export class Users {
    status: boolean;
    totalCount:number;
    users: User[] = [];
}

export class User {
    status: string;
    _id: string;
    venueId: string;
    email: string;
    userRole: string;
    name: number;
    phoneNumber: number;
    empId:string;
    deliveryAreaId:string;
}

export class PolicySignature {
    status: boolean;
    policysiganture: { 
        fields: { 
            key: string
        }
    }
}

export class Media {
    url: string;
}
