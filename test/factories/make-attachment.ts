import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment, AttachmentProps } from "@/domain/management/enterprise/entities/attachment";
import { faker } from "@faker-js/faker"


export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId
) {
  const attachment = Attachment.create({
    title: faker.lorem.slug(),
    url: faker.internet.url(),
    ...override
  }, id)
  return attachment
}