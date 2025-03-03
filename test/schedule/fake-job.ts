import { Job } from "@/domain/notification/aplication/schedule/job";

export class FakeJob implements Job {
  private jobs: Array<{ name: string; callback: () => Promise<void> }> = []
  jobExists(jobName: string): boolean {
    const job = this.jobs.filter(job => job.name === jobName)

    if (job) {
      return true
    } else {
      return false
    }
  }

  // Executa todos os jobs agendados (simula a execução no teste)
  async executeJobs() {
    for (const job of this.jobs) {
      console.log(`Executing job: ${job.name}`)
      await job.callback()
    }
  }

  // Remove o job agendado
  deleteJob(name: string) {
    this.jobs = this.jobs.filter(job => job.name !== name)
    console.log(`Job deleted: ${name}`)
  }
}
