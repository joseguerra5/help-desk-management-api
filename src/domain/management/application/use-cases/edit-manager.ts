import { Either, left, right } from "@/core/either"
import { Manager } from "../../enterprise/entities/manager"
import { AlreadyExistsError } from "./errors/already-exist-error"
import { Injectable } from "@nestjs/common"
import { HashGenerator } from "../cryptography/hash-generator"
import { ManagerRepository } from "../repositories/manager-repository"
import { CredentialDoNotMatchError } from "./errors/credentials-not-match"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { HashComparer } from "../cryptography/hash-comparer"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

interface EditManagerUseCaseRequest {
  managerId: string
  name: string,
  userName: string,
  employeeId: string,
  email: string,
  password: string,
  newPassword?: string,
  newPasswordConfirmation?: string,
}

type EditManagerUseCaseReponse = Either<AlreadyExistsError, {
  manager: Manager
}>

@Injectable()
export class EditManagerUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) { }
  async execute({
    managerId,
    name,
    userName,
    employeeId,
    email,
    password,
    newPassword,
    newPasswordConfirmation,
  }: EditManagerUseCaseRequest): Promise<EditManagerUseCaseReponse> {
    const manager = await this.managerRepository.findById(managerId)

    if (!manager) {
      return left(new ResourceNotFoundError("Manager", managerId))
    }

    const passwordIsValid = await this.hashComparer.compare(password, manager.password)

    if (!passwordIsValid) {
      return left(new NotAllowedError())
    }

    if (newPassword) {
      if (newPassword !== newPasswordConfirmation) {
        return left(new CredentialDoNotMatchError())
      }

      const newPasswordHash = await this.hashGenerator.hash(newPassword)

      manager.password = newPasswordHash
    }

    if (manager.email !== email) {
      const managerWithSameEmail = await this.managerRepository.findByEmail(email)

      if (managerWithSameEmail) {
        return left(new AlreadyExistsError("Manager", email))
      }

      manager.email = email
    }

    if (manager.employeeId.toString() !== employeeId) {
      const managerWithSameemployeeId = await this.managerRepository.findByEmployeeId(employeeId)

      if (managerWithSameemployeeId) {
        return left(new AlreadyExistsError("Manager", employeeId))
      }

      manager.employeeId = new UniqueEntityId(employeeId)
    }

    manager.name = name
    manager.userName = userName

    await this.managerRepository.save(manager)

    return right({
      manager
    })
  }
}