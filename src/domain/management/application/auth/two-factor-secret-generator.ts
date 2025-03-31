import { Manager } from "../../enterprise/entities/manager";

export abstract class TwoFactorAuthenticationSecret {
  abstract generateTwoFactorAuthenticationSecret(manager: Manager): Promise<{ secret: string, otpAuthUrl: string }>;
}
