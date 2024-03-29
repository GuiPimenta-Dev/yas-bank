import AuthDTO from "../../../dto/application/AuthDTO";
import OutputDTO from "../../../dto/application/OutputDTO";
import MakeNationalRechargeDTO from "../../../dto/usecase/MakeNationalRechargeDTO";
import NationalRechargeFacadeInterface from "../../../domain/infra/baas/facade/NationalRechargeFacade";
import HttpClientInterface from "../../../domain/infra/http/HttpClient";
import ConsultNationalProviders from "../celcoin/national_recharge/ConsultNationalProviders";
import ConsultNationalValues from "../celcoin/national_recharge/ConsultNationalValues";
import MakeNationalRecharge from "../celcoin/national_recharge/MakeNationalRecharge";

export default class NationalRechargeFacade implements NationalRechargeFacadeInterface {
  constructor(readonly httpClient: HttpClientInterface) {}

  async consultNationalProviders(stateCode: number, auth: AuthDTO): Promise<OutputDTO> {
    const nationalRecharge = new ConsultNationalProviders(this.httpClient);
    return await nationalRecharge.consultNationalProviders(stateCode, auth.celcoinToken);
  }

  async consultNationalValues(stateCode: number, providerId: number, auth: AuthDTO): Promise<OutputDTO> {
    const nationalRecharge = new ConsultNationalValues(this.httpClient);
    return await nationalRecharge.consultNationalValues(stateCode, providerId, auth.celcoinToken);
  }

  async makeNationalRecharge(input: MakeNationalRechargeDTO, auth: AuthDTO): Promise<OutputDTO> {
    const nationalRecharge = new MakeNationalRecharge(this.httpClient);
    const { data } = await nationalRecharge.reserveBalance(input, auth.document, auth.celcoinToken);
    const { receipt, transactionId } = data;
    await nationalRecharge.confirmRecharge(transactionId, auth.celcoinToken);
    return { statusCode: 200, data: { receipt, transactionId } };
  }
}
