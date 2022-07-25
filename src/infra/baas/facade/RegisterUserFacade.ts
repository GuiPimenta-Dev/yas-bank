import HttpError from "../../../application/error/HttpError";
import OutputDTO from "../../../domain/dto/application/OutputDTO";
import ConfirmUserPhoneDTO from "../../../domain/dto/usecase/ConfirmUserPhoneDTO";
import RegisterAdditionalInfoDTO from "../../../domain/dto/usecase/RegisterAdditionalInfoDTO";
import RegisterAddressInfoDTO from "../../../domain/dto/usecase/RegisterAddressInfoDTO";
import RegisterUserInfoDTO from "../../../domain/dto/usecase/RegisterUserInfoDTO";
import UploadDocumentImageDTO from "../../../domain/dto/usecase/UploadDocumentImageDTO";
import RegisterUserFacadeInterface from "../../../domain/infra/baas/facade/RegisterUserFacade";
import HttpClient from "../../../domain/infra/http/HttpClient";
import ConfirmUserPhone from "../cronos/register_user/ConfirmUserPhone";
import CreatePassword from "../cronos/register_user/CreatePassword";
import RegisterAdditionalInfo from "../cronos/register_user/RegisterAdditionalInfo";
import RegisterAddressInfo from "../cronos/register_user/RegisterAddressInfo";
import RegisterUserInfo from "../cronos/register_user/RegisterUserInfo";
import UploadDocumentImage from "../cronos/register_user/UploadDocumentImage";
import UploadSelfie from "../cronos/register_user/UploadSelfie";
import UploadSignature from "../cronos/register_user/UploadSignature";

export default class RegisterUserFacade implements RegisterUserFacadeInterface {
  constructor(readonly httpClient: HttpClient) {}

  async registerUserInfo(input: RegisterUserInfoDTO): Promise<OutputDTO> {
    const { document, name, username, email, phone } = input;
    const registerUserInfo = new RegisterUserInfo(this.httpClient);
    if (await registerUserInfo.isUserRegistered(document)) throw new HttpError(400, "User already registered");
    var { data } = await registerUserInfo.registerUserDocument(document);
    var { individual_id: individualId } = data;
    var { data } = await registerUserInfo.registerUserPersonalInfo({ individualId, name, username, email });
    return await registerUserInfo.registerUserPhone(individualId, phone.stateCode, phone.number);
  }

  async confirmUserPhone(input: ConfirmUserPhoneDTO): Promise<OutputDTO> {
    const confirmUserPhone = new ConfirmUserPhone(this.httpClient);
    return await confirmUserPhone.confirmSMSCode(input);
  }

  async uploadDocumentImage(input: UploadDocumentImageDTO): Promise<OutputDTO> {
    const uploadDocumentImage = new UploadDocumentImage(this.httpClient);
    return await uploadDocumentImage.sendImage(input);
  }

  async registerAdditionalInfo(input: RegisterAdditionalInfoDTO): Promise<OutputDTO> {
    const registerAdditionalInfo = new RegisterAdditionalInfo(this.httpClient);
    return await registerAdditionalInfo.sendInfo(input);
  }

  async uploadSignature(document: string, file: File | string, type: string): Promise<OutputDTO> {
    const uploadSignature = new UploadSignature(this.httpClient);
    return await uploadSignature.sendSignature(document, file, type);
  }

  async uploadSelfie(document: string, file: any): Promise<OutputDTO> {
    const uploadSelfie = new UploadSelfie(this.httpClient);
    return await uploadSelfie.sendSelfie(document, file);
  }

  async registerAddressInfo(input: RegisterAddressInfoDTO): Promise<OutputDTO> {
    const registerAddressInfo = new RegisterAddressInfo(this.httpClient);
    return await registerAddressInfo.registerAddressInfo(input);
  }

  async createPassword(document: string, password: string, confirmPassword: string): Promise<OutputDTO> {
    const createPassword = new CreatePassword(this.httpClient);
    return await createPassword.createPassword(document, password, confirmPassword);
  }
}