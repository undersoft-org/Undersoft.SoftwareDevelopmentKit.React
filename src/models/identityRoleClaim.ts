import { Model } from "./model";

export interface IdentityRoleClaim extends Model {

    RoleId?: number;
    ClaimType?: string;
    ClaimValue?: string;

}
