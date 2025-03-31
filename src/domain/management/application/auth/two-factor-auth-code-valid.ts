import { Manager } from "../../enterprise/entities/manager";

export abstract class TwoFactorAuthenticationCodeValidation {
  abstract isTwoFactorAuthenticationCodeValid(manager: Manager, twoFactorAuthenticationCode: string): Promise<boolean>;
}
