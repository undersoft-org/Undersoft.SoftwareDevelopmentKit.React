import { AccountIdentityRoleClaim } from "./accountIdentityRoleClaim";
import { IdentityRole } from "./identityRole";
import { Model } from "./model";

export interface AccountIdentityRole extends Model {

    Info?: IdentityRole;
    Claims?: AccountIdentityRoleClaim[];
}
