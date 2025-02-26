import { Manager } from '../../enterprise/entities/manager';

export abstract class ManagerRepository {
  abstract create(manager: Manager): Promise<void>;
  abstract save(manager: Manager): Promise<void>;
  abstract findById(id: string): Promise<Manager | null>;
  abstract findByEmail(email: string): Promise<Manager | null>;
  abstract findByEmployeeId(id: string): Promise<Manager | null>;
}
