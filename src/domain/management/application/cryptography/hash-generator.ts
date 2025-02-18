export abstract class HashHenerator {
  abstract hash(plain: string): Promise<string>
}