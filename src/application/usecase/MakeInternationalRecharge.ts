import UseCaseInterface from "../../domain/application/UseCase";
import BaasFacadeInterface from "../../domain/baas/BaasFacade";
import BaasFactoryInterface from "../../domain/baas/BaasFactory";
import Document from "../../domain/entity/Document";
import InternationalPhone from "../../domain/entity/InternationalPhone";
import InternationalRechargeMade from "../../domain/event/InternationalRechargeMade";
import Broker from "../../infra/broker/Broker";
import MakeInternationalRechargeDTO from "../dto/MakeInternationalRechargeDTO";
import TokenDTO from "../dto/TokenDTO";

export default class MakeInternationalRecharge implements UseCaseInterface {
  baasFacade: BaasFacadeInterface;

  constructor(baasFactory: BaasFactoryInterface, readonly broker: Broker) {
    this.baasFacade = baasFactory.createCellcoinFacade();
  }

  async execute(input: MakeInternationalRechargeDTO, token: TokenDTO): Promise<{ receipt: string }> {
    const { value, productId, phone } = input;
    new InternationalPhone(phone.countryCode, phone.number);
    const document = new Document(input.document).getDocument();
    const makeInternationalRechargeDTO = { value, document, productId, phone };
    const { receipt, transactionId } = await this.baasFacade.makeInternationalRecharge(
      makeInternationalRechargeDTO,
      token
    );
    this.broker.publish(new InternationalRechargeMade(document, transactionId, value, productId));
    return { receipt };
  }
}
