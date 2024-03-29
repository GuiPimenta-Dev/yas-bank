import BaasFactory from "../../../../src/infra/baas/BaasFactory";
import Broker from "../../../../src/infra/broker/Broker";
import MakeInternationalRecharge from "../../../../src/usecase/international_recharge/MakeInternationalRecharge";
import { fakeAuth } from "../../../utils/Fixtures";
import FakeHandler from "../../../utils/mocks/broker/FakeHandler";
import FakeHttpClient from "../../../utils/mocks/httpclient/FakeHttpClient";

test("Should be able to make an international recharge", async () => {
  const httpClient = new FakeHttpClient();
  httpClient.mockPost({ receipt: "fake-receipt", transactionId: 123456789 });
  const baasFactory = new BaasFactory(httpClient);
  const internationalRechargeFacade = baasFactory.createInternationalRechargeFacade();
  const broker = new Broker();
  const fakeHandler = new FakeHandler("InternationalRechargeMade");
  broker.register(fakeHandler);
  const makeInternationalRecharge = new MakeInternationalRecharge(internationalRechargeFacade, broker);
  const body = {
    document: "35914746817",
    value: 5.43,
    productId: 5,
    phone: { countryCode: 509, number: 48227030 },
  };
  const { data } = await makeInternationalRecharge.execute(body, fakeAuth());
  expect(data.receipt).toBe("fake-receipt");
  expect(fakeHandler.fakeRepository).toHaveLength(1);
  expect(fakeHandler.fakeRepository[0].document).toBe("35914746817");
  expect(fakeHandler.fakeRepository[0].name).toBe("InternationalRechargeMade");
  expect(fakeHandler.fakeRepository[0].transactionId).toBe(123456789);
  expect(fakeHandler.fakeRepository[0].value).toBe(5.43);
  expect(fakeHandler.fakeRepository[0].productId).toBe(5);
});
