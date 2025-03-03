export abstract class Schedule {
  abstract scheduleOnce(name: string, date: Date, callback: () => Promise<void>): void;
  abstract scheduleRecurring(name: string, cron: string, callback: () => Promise<void>): void;
}
