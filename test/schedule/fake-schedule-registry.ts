import { Schedule } from '@/domain/notification/aplication/schedule/schedule-registry';

export class FakeScheduleRegistry implements Schedule {
  private jobs: Array<{ name: string; callback: () => Promise<void> }> = []

  // Armazena os jobs agendados
  async scheduleOnce(name: string, date: Date, callback: () => Promise<void>) {
    const job = { name, callback }
    this.jobs.push(job)

    if (date <= new Date()) {
      await callback()
    }
  }

  // Armazena o job recorrente
  async scheduleRecurring(name: string, cron: string, callback: () => Promise<void>) {
    const job = { name, callback }
    this.jobs.push(job)
  }

}
