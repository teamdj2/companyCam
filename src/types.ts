export interface WorkFlow {
    name: string,
    id: string | number,
    type: string,
    enabled: boolean,
    insertedAt: string | number,
    updatedAt: string | number,
    personalTagIds: [],
    contactListIds: ContactListIds[],
}

export interface ContactListIds {
    enrolled: string | number,
    active: string | number,
    steps: [],
}

export interface CompanyCam {
    id: string | number,
    company_id: string | number,
    
}

export interface Address {
    street_address_1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}
  
export interface Coordinates {
    lat: number;
    lon: number;
}
  
export interface Image {
    type: string;
    url: string;
}
  
 export interface Integration {
    type: string;
    relation_id: string;
}
  
export interface Geofence {
    lat: number;
    lon: number;
}
  
export interface PrimaryContact {
    id?: string;
    project_id?: string;
    name: string;
    email: string;
    phone_number: string;
    created_at?: number;
    updated_at?: number;
}
  
export interface Project {
    id: string | number;
    company_id: string | number;
    creator_id: string | number;
    creator_type: string;
    creator_name: string;
    status: string;
    name: string;
    address: Address;
    coordinates: Coordinates;
    featured_image: Image[];
    project_url: string;
    embedded_project_url: string;
    integrations: Integration[];
    slug: string;
    public: boolean;
    geofence: Geofence[];
    primary_contact: PrimaryContact;
    notepad: string;
    created_at: number;
    updated_at: number;
}
  

export interface Deal {
    name: string,
    city: string,
    street_address_1: string,
    postal_code: string,
    state: string,
    contact_name1: string,
    contact_name2: string,
    email: string,
    phone_number: string | number,
    stage: string | number,
    owner?: string,
}

export interface PUT{
    name: string,
    address: {
        street_address_1?: string,
        city?: string,
        state?: string,
        postal_code?: string,
        country?: "US",
    }
}
