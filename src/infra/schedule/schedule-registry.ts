import { Schedule } from "@/domain/notification/aplication/schedule/schedule-registry";
import { CronJob } from "@/infra/schedule/cron-job";

export class ScheduleRegistry implements Schedule {
  private jobs: Map<string, NodeJS.Timeout> = new Map();
  private cronJob: CronJob;

  constructor() {
    this.cronJob = new CronJob();
  }

  scheduleOnce(name: string, date: Date, callback: () => Promise<void>): void {
    const delay = date.getTime() - Date.now();
    if (delay <= 0) {
      console.warn(`⚠️ Tentativa de agendar job no passado: ${name}`);
      return;
    }

    const timeout = setTimeout(async () => {
      await callback();
      this.jobs.delete(name);
    }, delay);

    this.jobs.set(name, timeout);
  }

  scheduleRecurring(name: string, cronExpression: string, callback: () => Promise<void>): void {
    this.cronJob.scheduleRecurring(name, cronExpression, callback);
  }

  deleteJob(name: string): void {
    if (this.jobs.has(name)) {
      clearTimeout(this.jobs.get(name)!);
      this.jobs.delete(name);
    }

    this.cronJob.deleteJob(name);
  }
}
