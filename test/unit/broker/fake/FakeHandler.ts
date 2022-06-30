import Handler from "../../../../src/infra/broker/Handler";
import FakeDomainEvent from "./FakeDomainEvent";

export default class FakeHandler implements Handler {
  name = "FakeDomainEvent";
  constructor(readonly fakeRepository: FakeDomainEvent[] = []) {}

  handle(event: FakeDomainEvent): void {
    this.fakeRepository.push(event);
  }
}