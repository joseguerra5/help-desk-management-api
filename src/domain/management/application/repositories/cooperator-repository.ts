import { Cooperator } from "../../enterprise/entities/cooperator";

export abstract class CooperatorRepository {
  abstract create(cooperator: Cooperator): Promise<void>
  abstract save(cooperator: Cooperator): Promise<void>
  abstract findById(id: string): Promise<Cooperator | null>
  abstract findByEmail(email: string): Promise<Cooperator | null>
  abstract findByEmployeeId(id: string): Promise<Cooperator | null>
}