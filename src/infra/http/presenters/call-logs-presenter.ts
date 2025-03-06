import { CallLog } from '@/domain/management/enterprise/entities/callLog'

export class CallLogPresenter {
  static toHTTP(callLog: CallLog) {
    return {
      id: callLog.id,
      cooperatorId: callLog.cooperatorId,
      madeBy: callLog.madeBy,
      type: callLog.type,
      description: callLog.description,
      createdAt: callLog.createdAt,
      updatedAt: callLog.updatedAt,
    }
  }
}
