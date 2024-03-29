import Handler from "../../../../src/application/handler/implements/Handler";
import DomainEvent from "../../../../src/domain/event/implements/DomainEvent";

export default class FakeHandler implements Handler {
  constructor(readonly name: string, readonly fakeRepository: any[] = []) {}

  handle(event: DomainEvent): void {
    this.fakeRepository.push(event);
  }
}
