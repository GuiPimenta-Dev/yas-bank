import OutputDTO from "../../../../dto/application/OutputDTO";
import MakeInternationalRechargeDTO from "../../../../dto/usecase/MakeInternationalRechargeDTO";
import HttpClientInterface from "../../../../domain/infra/http/HttpClient";

export default class MakeInternationalRecharge {
  constructor(readonly httpClient: HttpClientInterface) {}

  async reserveBalance(input: MakeInternationalRechargeDTO, document: string, token: string): Promise<OutputDTO> {
    const body = {
      value: input.value,
      cpfCnpj: document,
      topupProductId: input.productId,
      phone: input.phone,
    };
    const { statusCode, data } = await this.httpClient.post(
      process.env.CELLCOIN_BASE_URL + "/transactions/internationaltopups",
      body,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return { statusCode, data };
  }

  async confirmRecharge(transactionId: number, token: string): Promise<OutputDTO> {
    const url = process.env.CELLCOIN_BASE_URL + `/transactions/internationaltopups/${transactionId}/capture`;
    const data = {};
    return await this.httpClient.put(url, data, {
      Authorization: `Bearer ${token}`,
    });
  }
}
