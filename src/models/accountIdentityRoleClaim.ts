import { Model } from "./model";

export interface AccountIdentityRoleClaim extends Model {
    RoleId?: number;
    ClaimType?: string;
    ClaimValue?: string;
}
