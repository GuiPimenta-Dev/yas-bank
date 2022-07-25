import env from "../../../../../env";
import OutputDTO from "../../../../domain/dto/application/OutputDTO";
import UploadDocumentImageDTO from "../../../../domain/dto/usecase/UploadDocumentImageDTO";
import HttpClientInterface from "../../../../domain/infra/http/HttpClient";
import User from "./User";

export default class UploadDocumentImage extends User {
  constructor(httpClient: HttpClientInterface) {
    super(httpClient);
  }

  async sendImage(input: UploadDocumentImageDTO): Promise<OutputDTO> {
    const { document, documentType, imageType, file } = input;
    const individualId = await this.getUserIndividualId(document);
    const body = {
      document_type: documentType,
      image_type: imageType,
      file,
    };
    return await this.httpClient.post(env.CRONOS_BASE_URL + "/register/individual/step3/" + individualId, body, {
      Authorization: `Bearer ${env.CRONOS_SECRET}`,
    });
  }
}