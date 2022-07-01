import MakeInternationalRecharge from "../../../src/application/usecase/MakeInternationalRecharge";
import Broker from "../../../src/infra/broker/Broker";
import CellcoinFacade from "../../../src/infra/facade/CellcoinFacade";
import CellcoinFactory from "../../../src/infra/factory/CellcoinFactory";
import AxiosAdapter from "../../../src/infra/http/AxiosAdapter";
import FakeMakeInternationalRechargeHandler from "../fake/FakeMakeInternationalRechargeHandler";
test.skip("Should be able to make an international recharge", async () => {
  const httpClient = new AxiosAdapter();
  const cellcoinFactory = new CellcoinFactory(httpClient);
  const cellcoinFacade = new CellcoinFacade(cellcoinFactory);
  const broker = new Broker();
  const fakeMakeInternationalRechargeHandler = new FakeMakeInternationalRechargeHandler();
  broker.register(fakeMakeInternationalRechargeHandler);
  const makeInternationalRecharge = new MakeInternationalRecharge(cellcoinFacade, broker);
  const data = {
    id: "41b44ab9a56440.teste.celcoinapi.v5",
    document: "35914746817",
    value: 5.43,
    productId: 5,
    phone: { countryCode: 509, number: 48227030 },
  };
  const result = await makeInternationalRecharge.execute(data);
  expect(result).toHaveProperty("receipt");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository).toHaveLength(1);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].document).toBe("35914746817");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].name).toBe("InternationalRechargeMade");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0]).toHaveProperty("transactionId");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].value).toBe(5.43);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].productId).toBe(5);
});