import UseCaseInterface from "../../domain/application/UseCase";
import BaasFacadeInterface from "../../domain/baas/BaasFacade";
import BaasFactoryInterface from "../../domain/baas/BaasFactory";
import TokenDTO from "../dto/TokenDTO";

export default class ConsultAvailableCountries implements UseCaseInterface {
  baasFacade: BaasFacadeInterface;

  constructor(baasFactory: BaasFactoryInterface) {
    this.baasFacade = baasFactory.createCellcoinFacade();
  }

  async execute(page: number, token: TokenDTO): Promise<{ countries: any }> {
    return await this.baasFacade.consultAvailableCountries(page, token);
  }
}
