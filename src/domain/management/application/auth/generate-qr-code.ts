
export abstract class GenerateQrCode {
  abstract generateQrCode(otpAuthUrl: string): Promise<string>;
}
