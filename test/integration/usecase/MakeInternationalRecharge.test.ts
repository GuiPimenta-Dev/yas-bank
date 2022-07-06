import TokenDTO from "../../../src/application/dto/TokenDTO";
import MakeInternationalRecharge from "../../../src/application/usecase/MakeInternationalRecharge";
import BaasFactory from "../../../src/infra/baas/BaasFactory";
import Broker from "../../../src/infra/broker/Broker";
import AxiosAdapter from "../../../src/infra/http/adapter/AxiosAdapter";
import FakeMakeInternationalRechargeHandler from "../utils/fake/handler/FakeMakeInternationalRechargeHandler";
import { getToken } from "../utils/fixtures";

let token: TokenDTO;
beforeAll(async () => {
  token = await getToken();
});

test("Should be able to make an international recharge", async () => {
  const httpClient = new AxiosAdapter();
  const baasFactory = new BaasFactory(httpClient);
  const broker = new Broker();
  const fakeMakeInternationalRechargeHandler = new FakeMakeInternationalRechargeHandler();
  broker.register(fakeMakeInternationalRechargeHandler);
  const makeInternationalRecharge = new MakeInternationalRecharge(baasFactory, broker);
  const body = {
    document: "35914746817",
    value: 5.43,
    productId: 5,
    phone: { countryCode: 509, number: 48227030 },
  };
  const { data } = await makeInternationalRecharge.execute(body, token);
  expect(data).toHaveProperty("receipt");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository).toHaveLength(1);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].document).toBe("35914746817");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].name).toBe("InternationalRechargeMade");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0]).toHaveProperty("transactionId");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].value).toBe(5.43);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].productId).toBe(5);
});
