import OutputDTO from "../../../../dto/application/OutputDTO";
import HttpClientInterface from "../../../../domain/infra/http/HttpClient";
import User from "./User";

export default class AcceptTerm extends User {
  constructor(readonly httpClient: HttpClientInterface) {
    super(httpClient);
  }

  async acceptTerm(document: string, term: string, code: string): Promise<OutputDTO> {
    const individualId = await this.getUserIndividualId(document);
    const URL = process.env.CRONOS_BASE_URL + "/account/assinarTermo";
    return await this.httpClient.post(
      URL,
      {
        individual_id: individualId,
        tipo_termo: term,
        token: code,
      },
      { Authorization: `Bearer ${process.env.CRONOS_SECRET}` }
    );
  }
}
