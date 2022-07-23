import HttpError from "../../../application/error/HttpError";
import OutputDTO from "../../../domain/dto/application/OutputDTO";
import ConfirmUserPhoneDTO from "../../../domain/dto/usecase/ConfirmUserPhoneDTO";
import RegisterUserInfoDTO from "../../../domain/dto/usecase/RegisterUserInfoDTO";
import RegisterUserFacadeInterface from "../../../domain/infra/baas/facade/RegisterUserFacade";
import HttpClient from "../../../domain/infra/http/HttpClient";
import ConfirmUserPhone from "../cronos/register_user/ConfirmUserPhone";
import RegisterUserInfo from "../cronos/register_user/RegisterUserInfo";

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

  confirmUserPhone(input: ConfirmUserPhoneDTO): Promise<OutputDTO> {
    const confirmUserPhone = new ConfirmUserPhone(this.httpClient);
    return confirmUserPhone.confirmSMSCode(input);
  }
}
