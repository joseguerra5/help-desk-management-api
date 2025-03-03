export abstract class Job {
  abstract deleteJob(jobName: string): void;
  abstract jobExists(jobName: string): boolean;
}