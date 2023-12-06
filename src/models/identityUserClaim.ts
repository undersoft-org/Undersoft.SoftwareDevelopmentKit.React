import { Model } from "./model";

export interface IdentityUserClaim extends Model {

    UserId?: number;
    ClaimType?: string;
    ClaimValue?: string;
}
