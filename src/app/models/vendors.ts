export class Vendors {
    status: boolean;
    totalCount: number;
    vendors: Vendor[] = [];
}

export class Vendor {
    id: string;
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    contactName: string;
    address: string;
    latitude: string;
    longitude: string;
    deliveryTime: string;
    category: string;
    profilePicture: string;
    mediaId: {_id:string,mediaId:string}
    createdDate: string;
    modifiedDate: string;   
    status: boolean;
    cuisineType: string;
    license: string;
    taxId: string;
    bgColor: string;
    deliveryAreaId: string;
    deliveryLocationId: string;
    userId:{_id:string,status:string}
}
export class InviteUser {
    venueId: string;
    email: string;
    userRole: string;
    name: string;
}
export class UserDetails {
    status: boolean;
    id: string;
    error: string;
}

export class postFile {
    status: boolean;
    policysiganture:{key:string,aws_access_key_id:string,base64policy: string,siganture: string}
}

export class vendorOperatingHours {
    status: boolean;
    totalCount: number;
    vendorOperatingHours: {
        _id :string
        dayOfWeek :string
        opening :string
        closing :string
    };
}


