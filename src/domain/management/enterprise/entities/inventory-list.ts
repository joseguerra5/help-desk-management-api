import { WatchedList } from '@/core/entities/watched-list';
import { CooperatorEquipment } from './cooperator-equipment';

export class InventoryList extends WatchedList<CooperatorEquipment> {
  compareItems(a: CooperatorEquipment, b: CooperatorEquipment): boolean {
    return a.equipmentId.equals(b.equipmentId);
  }
}
