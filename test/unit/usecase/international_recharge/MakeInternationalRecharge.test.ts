import MakeInternationalRecharge from "../../../../src/application/usecase/international_recharge/MakeInternationalRecharge";
import BaasFactory from "../../../../src/infra/baas/BaasFactory";
import Broker from "../../../../src/infra/broker/Broker";
import FakeMakeInternationalRechargeHandler from "../../../utils/fake/handler/FakeMakeInternationalRechargeHandler";
import FakeHttpClient from "../../../utils/fake/httpclient/FakeHttpClient";
import { fakeAuth } from "../../../utils/fixtures";

test("Should be able to make an international recharge", async () => {
  const httpClient = new FakeHttpClient();
  httpClient.mockPost({ receipt: "fake-receipt", transactionId: 123456789 });
  const baasFactory = new BaasFactory(httpClient);
  const internationalRechargeFacade = baasFactory.createInternationalRechargeFacade();
  const broker = new Broker();
  const fakeMakeInternationalRechargeHandler = new FakeMakeInternationalRechargeHandler();
  broker.register(fakeMakeInternationalRechargeHandler);
  const makeInternationalRecharge = new MakeInternationalRecharge(internationalRechargeFacade, broker);
  const body = {
    document: "35914746817",
    value: 5.43,
    productId: 5,
    phone: { countryCode: 509, number: 48227030 },
  };
  const { data } = await makeInternationalRecharge.execute(body, fakeAuth());
  expect(data.receipt).toBe("fake-receipt");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository).toHaveLength(1);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].document).toBe("35914746817");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].name).toBe("InternationalRechargeMade");
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].transactionId).toBe(123456789);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].value).toBe(5.43);
  expect(fakeMakeInternationalRechargeHandler.fakeRepository[0].productId).toBe(5);
});