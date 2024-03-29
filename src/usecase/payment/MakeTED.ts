import AuthDTO from "../../dto/application/AuthDTO";
import OutputDTO from "../../dto/application/OutputDTO";
import MakeTEDDTO from "../../dto/usecase/MakeTedDTO";
import PaymentFacadeInterface from "../../domain/infra/baas/facade/PaymentFacade";

export default class MakeTed {
  constructor(private paymentFacade: PaymentFacadeInterface) {}

  async execute(input: MakeTEDDTO, auth: AuthDTO): Promise<OutputDTO> {
    return await this.paymentFacade.makeTed(input, auth);
  }
}
