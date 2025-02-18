import { WatchedList } from '@/core/entities/watched-list'
import { Equipment } from './equipment'

export class EquipmentList extends WatchedList<Equipment> {
  compareItems(a: Equipment, b: Equipment): boolean {
    return a.type.equals(b.cooperatorId)
  }
}
