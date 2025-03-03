import { Job } from "@/domain/notification/aplication/schedule/job";
import cron from "node-cron";

export class CronJob implements Job {
  private recurringJobs: Map<string, cron.ScheduledTask> = new Map();

  scheduleRecurring(name: string, cronExpression: string, callback: () => Promise<void>): void {
    if (this.recurringJobs.has(name)) {
      return;
    }

    const task = cron.schedule(cronExpression, async () => {
      await callback();
    });

    this.recurringJobs.set(name, task);
  }

  deleteJob(jobName: string): void {
    if (this.recurringJobs.has(jobName)) {
      this.recurringJobs.get(jobName)!.stop();
      this.recurringJobs.delete(jobName);
    }
  }

  jobExists(jobName: string): boolean {
    return this.recurringJobs.has(jobName);
  }
}
