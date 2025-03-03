import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  public aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    // todo evento que vai ser chamado pelo addDomainEvent tem que ser representado por uma classe
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Event', () => {
  it('should be able to dispatch and listen to domain events', () => {
    const callbackSpy = vi.fn()
    // começa a ouvir os eventos, subscribe cadastrado
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // cria um novo aggregate (cria resposta sem salvar no banco)
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // repositorio que lida com o BD vai chamar o dispatchEventsForAggregate passando o id e dispara o call back
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    // espera que não tem mais eventos
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
