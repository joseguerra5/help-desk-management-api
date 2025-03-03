import { Schedule } from '@/domain/notification/aplication/schedule/schedule-registry';
import { Module } from '@nestjs/common';
import { ScheduleRegistry } from './schedule-registry';
import { Job } from '@/domain/notification/aplication/schedule/job';
import { CronJob } from './cron-job';


@Module({
  providers: [
    {
      provide: Schedule,
      useClass: ScheduleRegistry,
    },
    {
      provide: Job,
      useClass: CronJob,
    }
  ],
  exports: [Job, Schedule],
})
export class ScheduleModule { }
