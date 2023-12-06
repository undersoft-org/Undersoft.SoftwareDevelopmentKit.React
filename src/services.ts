import { AccountIdentity } from '@/models/accountIdentity';
import { ServiceBase } from '@/serviceBase';

export default class IdentityService extends ServiceBase<AccountIdentity, AccountIdentity> {
    public constructor(endpoint: string) {
        super(endpoint);
    }
}