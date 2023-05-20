const request = require("supertest");
const sinon = require("sinon");
const createApp = require("../app");

const userRoutes = require("../app/routes/userRoutes");
const ownerRoutes = require("../app/routes/ownerRoutes");
const statusRoutes = require("../app/routes/statusRoutes");

const { restaurantsMock, tablesMock, productsMock, ordersMock, tabsMock } = require("./mocks/db");

describe("App", () => {

  const app = createApp({});

  test("GET /api/status responds with 200", async () => {
    const response = await request(app).get("/api/status");
    expect(response.statusCode).toBe(200);
  });

  test("GET /api/user/getRandomTable/:restaurantId responds with 200", async () => {
    tablesMock.expects("findOne").resolves({ _id: "1" });
    const response = await request(app).get("/api/user/getRandomTable/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ _id: "1" });
  });

  test("GET /api/user/tables/:tableId responds with 200", async () => {
    tabsMock.expects("findById").resolves({ _id: "1" });
    tablesMock.expects("findById").resolves({ _id: "1", tabOpen: false });
    const response = await request(app).get("/api/user/tables/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ _id: "1" });
  });

  test("POST /api/user/orders/new/:tabId responds with 200", async () => {
    const cartProducts = [
      { _id: "1", qty: 1, price: 5 },
      { _id: "2", qty: 2, price: 10 }
    ];
    tabsMock.expects("findById").resolves({ _id: "1" });
    ordersMock.expects("create").resolves({ _id: "1", totalAmount: 25, items: ["1", "2", "2"] });
    const response = await request(app).post("/api/user/orders/new/1").send({ cartProducts });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ _id: "1", totalAmount: 25, items: ["1", "2", "2"] });
  });

  test("GET /api/owner/orders/active/:restaurantId responds with 200", async () => {
    ordersMock.expects("find").resolves([{ _id: "1" }]);
    const response = await request(app).get("/api/owner/orders/active/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ _id: "1" }]);
  });

  test("POST /api/owner/orders/update/:orderId responds with 200", async () => {
    ordersMock.expects("findById").resolves({ _id: "1", status: "received" });
    ordersMock.expects("updateOne").resolves({ n: 1, nModified: 1, ok: 1 });
    const response = await request(app).post("/api/owner/orders/update/1").send({ status: "inProgress" });
    expect(response.statusCode).toBe(200);
  });

  test("GET /api/user/tabs/:tabId responds with 200", async () => {
    tabsMock.expects("findById").resolves({ _id: "1" });
    const response = await request(app).get("/api/user/tabs/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ _id: "1" });
  });

  test("GET /api/user/tabs/:tabId responds with 404 when tab not found", async () => {
    tabsMock.expects("findById").resolves(null);
    const response = await request(app).get("/api/user/tabs/1");
    expect(response.statusCode).toBe(404);
  });

  test("GET /api/user/orders/:orderId responds with 200", async () => {
    ordersMock.expects("findById").resolves({ _id: "1" });
    const response = await request(app).get("/api/user/orders/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ _id: "1" });
  });

  test("GET /api/user/orders/:orderId responds with 404 when order not found", async () => {
    ordersMock.expects("findById").resolves(null);
    const response = await request(app).get("/api/user/orders/1");
    expect(response.statusCode).toBe(404);
  });

  test("GET /api/owner/settings responds with 200", async () => {
    restaurantsMock.expects("findOne").resolves({
      _id: "1",
      name: "RocknRolla",
      ownerName: "John Doe",
      maxInstances: 10
    });

    const response = await request(app).get("/api/owner/settings");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      restaurantId: "1",
      restaurantName: "RocknRolla",
      ownerName: "John Doe",
      maxInstances: 10
    });
  });

  // Error cases
  test("GET /api/user/menus/:id responds with 400 when id is missing", async () => {
    const response = await request(app).get("/api/user/menus/");
    expect(response.statusCode).toBe(404);
  });

  test("GET /api/user/tables/:tableId responds with 400 when tableId is missing", async () => {
    const response = await request(app).get("/api/user/tables/");
    expect(response.statusCode).toBe(404);
  });

  test("POST /api/user/orders/new/:tabId responds with 400 when tabId is missing", async () => {
    const response = await request(app).post("/api/user/orders/new/").send({});
    expect(response.statusCode).toBe(404);
  });

  test("POST /api/owner/orders/update/:orderId responds with 400 when orderId is missing", async () => {
    const response = await request(app).post("/api/owner/orders/update/").send({});
    expect(response.statusCode).toBe(404);
  });

});
