import ConsultNationalProviders from "../../../src/application/usecase/consult_national_providers/ConsultNationalProviders";
import CellcoinFacade from "../../../src/infra/facade/CellcoinFacade";
import CellcoinFactory from "../../../src/infra/factory/CellcoinFactory";
import AxiosAdapter from "../../../src/infra/http/AxiosAdapter";
test("It should be able to consult providers", async () => {
  const httpClient = new AxiosAdapter();
  const cellcoinFactory = new CellcoinFactory(httpClient);
  const cellcoinFacade = new CellcoinFacade(cellcoinFactory);
  const consultNationalProviders = new ConsultNationalProviders(cellcoinFacade);
  const response = await consultNationalProviders.execute("41b44ab9a56440.teste.celcoinapi.v5", 13);
  expect(response).toHaveProperty("providers");
});
