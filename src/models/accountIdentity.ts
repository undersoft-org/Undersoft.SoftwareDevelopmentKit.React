import { AccountIdentityClaim } from "./accountIdentityClaim";
import { AccountIdentityRole } from "./accountIdentityRole";
import { IdentityUser } from "./identityUser";
import { Credentials } from "./credentials";
import { Model } from "./model";

export interface AccountIdentity extends Model {
    Info?: IdentityUser;  
    Roles?: AccountIdentityRole;
    Claims?: AccountIdentityClaim;
    Credentials?: Credentials;
}





