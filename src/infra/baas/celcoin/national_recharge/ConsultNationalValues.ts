import OutputDTO from "../../../../dto/application/OutputDTO";
import HttpClientInterface from "../../../../domain/infra/http/HttpClient";

export default class consultNationalValues {
  constructor(readonly httpClient: HttpClientInterface) {}

  async consultNationalValues(stateCode: number, providerId: number, token: string): Promise<OutputDTO> {
    const { statusCode, data } = await this.httpClient.get(
      process.env.CELLCOIN_BASE_URL + "/transactions/topups/provider-values",
      { stateCode, providerId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    const { value: values } = data;
    return { statusCode, data: values };
  }
}
