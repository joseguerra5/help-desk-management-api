import { UniqueEntityId } from './unique-entity-id';

export class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: any;

  public equals(entity: Entity<props>): boolean {
    if (this === entity) {
      return true;
    }

    if (entity._id === this._id) {
      return true;
    }

    return false;
  }
  protected constructor(props: any, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId(id);
    this.props = props;
  }
}
