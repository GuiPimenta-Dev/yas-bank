import InternationalPhone from "../../domain/entity/InternationalPhone";
import BaasFacadeInterface from "../../domain/facade/BaasFacade";
import UseCaseInterface from "../../domain/usecase/UseCase";

export default class ConsultInternationalRechargeValues implements UseCaseInterface {
  constructor(readonly baasFacade: BaasFacadeInterface) {}
  async execute(id: string, countryCode: number, number: number): Promise<any> {
    const { value: phone } = new InternationalPhone(countryCode, number);
    return await this.baasFacade.consultInternationalRechargeValues(id, phone.countryCode, phone.number);
  }
}
