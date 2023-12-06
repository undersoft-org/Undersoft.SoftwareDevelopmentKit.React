import { Model } from "./model";

export interface IdentityUser extends Model {
        UserName?:string,
        Email?:string,
        EmailConfirmed?:boolean,
        PhoneNumber?:string,
        PhoneNumberConfirmed?:boolean,
        LockoutEnabled?: boolean,
        AccessFailedCount?:number
}





