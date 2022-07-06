import jwt from "jsonwebtoken";

import env from "../../../env";
import UseCaseInterface from "../../domain/application/UseCase";
import BaasFacadeInterface from "../../domain/baas/BaasFacade";
import BaasFactoryInterface from "../../domain/baas/BaasFactory";
import OutputDTO from "../dto/OutputDTO";

export default class Authorize implements UseCaseInterface {
  cellcoinFacade: BaasFacadeInterface;

  constructor(baasFactory: BaasFactoryInterface) {
    this.cellcoinFacade = baasFactory.createCellcoinFacade();
  }

  async execute(id: string, document: string): Promise<OutputDTO> {
    const { data: cellcoinToken } = await this.cellcoinFacade.authorize(id);

    const token = jwt.sign({ document, cellcoinToken }, env.JWT_SECRET, {
      expiresIn: "40min",
    });

    return { statusCode: 200, data: { token } };
  }
}
