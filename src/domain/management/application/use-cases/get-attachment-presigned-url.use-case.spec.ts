import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository';
import { GetAttachmentPresignedUrlUseCase } from './get-attachment-presigned-url.use-case';
import { FakePresignedUrl } from 'test/storage/fake-presigned-url';
import { makeAttachment } from 'test/factories/make-attachment';

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakePresignedUrl: FakePresignedUrl;
let sut: GetAttachmentPresignedUrlUseCase;

describe('Get Presigned URL By attachment Id', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakePresignedUrl =
      new FakePresignedUrl();
    sut = new GetAttachmentPresignedUrlUseCase(inMemoryAttachmentRepository, fakePresignedUrl);
  });
  it('should be able to get a presigned URL', async () => {
    const attachment = makeAttachment({
      url: "test"
    });

    await inMemoryAttachmentRepository.create(attachment)


    const result = await sut.execute({
      attachmentId: attachment.id.toString(),
    });

    expect(result.isRight()).toEqual(true);
  });
});
