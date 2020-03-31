export class Menu {
    status: boolean;
    users: 
        {
            userRoles:{ 
                menus: []
            },
            users:Menus
        }
    menuItem: Menus[] = [];  
}

export class MenuListing {
    status: boolean;
    menuItemTotalCount:number;
    menuItem: Menus[] = [];  
}

export class Menus {
    _id: string;
    name: string;
    description: string;
    price: string;
    status: boolean;
    mediaId: string;  
    currencyId: string;
    vendorId: string;
    venueId: string;
    preparationTime: string;
    vendorTagId: VendorTags[] = [];  
}

export class MenuMedia {
    _id: string;
    id: string;
    name: string;
    description: string;
    price: string;
    status: boolean;
    mediaId: { square: string, rectangle: string, bgColor: string };  
    currencyId: string;
    vendorId: string;
    venueId: string;
    preparationTime: string;
    vendorTagId: VendorTags[] = [];  
}

export class VendorTags {
    _id: string;
    vendorTagId: string;
}

export class MenuDetails {
    id:string;
    status: boolean;
    menuItems: Menus[] = [];  
}

export class menuOperatingHours {
    status: boolean;
    totalCount: number;
    menuItemAvailableHours: {
        _id :string
        dayOfWeek :string
        opening :string
        closing :string
    };
}