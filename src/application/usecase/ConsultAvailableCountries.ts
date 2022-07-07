import BaasFacadeInterface from "../../domain/infra/baas/BaasFacade";
import BaasFactoryInterface from "../../domain/infra/baas/BaasFactory";
import AuthDTO from "../dto/AuthDTO";
import OutputDTO from "../dto/OutputDTO";

export default class ConsultAvailableCountries {
  baasFacade: BaasFacadeInterface;

  constructor(baasFactory: BaasFactoryInterface) {
    this.baasFacade = baasFactory.createCellcoinFacade();
  }

  async execute(page: number, token: AuthDTO): Promise<OutputDTO> {
    return await this.baasFacade.consultAvailableCountries(page, token);
  }
}
