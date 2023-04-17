import supertest from "supertest";
import app from "./../../index.js";
import { User } from "../../models/User.js";
// jest.useFakeTimers();
describe("Test api-usuarios colmena", () => {
  
  //#region TEST CREATE USER
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJuYW1lIjoiSGVsbWVyIFZpbGxhcnJlYWwgTGFyaW9zIFVwZGF0ZSIsImNvZGVBY3RpdmF0aW9uIjoiNDcyMjE5Iiwicm9sIjoiYWRtaW4iLCJpZGVudGlmaWNhdGlvbiI6IjEwNTE2MzUzNDAiLCJhY3RpdmUiOnRydWUsImVtYWlsIjoiaGVsbWVydmlsbGFycmVhbEBnbWFpbC5jb20ifSwiaWF0IjoxNjgxNjkwMTg1LCJleHAiOjE2ODE3MTg5ODV9.5KlNJW47KH6EoKpSCIzXcDKEnwf4AKWsQ1zsRF5Dur8";
  const objectPost = {
    name: "USER TEST",
    password: "MTIzNDU2Nzg5",
    address: "address test",
    birthdate: "08/06/1990",
    identification: "8888888889",
    phone: "8888888888",
    email: "helmervillarreal@gmail.com",
    rol: "admin",
  };
  describe("[POST] - /api/users/create", () => {
    let response;

    const objectPostError = {
      name: "USER TEST",
      // password: "MTIzNDU2Nzg5",
      address: "address test",
      birthdate: "08/06/1990",
      // identification: "8888888889",
      phone: "8888888888",
      email: "helmervillarreal@gmail.com",
      rol: "admin",
    };

    beforeEach(async () => {
      // request endpoint
      response = await supertest(app)
        .post("/api/users/create")
        .set("Authorization", `bearer ${token}`)
        .send(objectPost);
    });

    afterAll(async () => {
      await User.destroy({
        where: { identification: objectPost.identification },
      });
    });

    it("response successfull and response format json - 200", async () => {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.headers["content-type"]).toContain("json");
    });

    it("validate correct insert user", async () => {
      expect(response.body.response.identification).toBe(
        objectPost.identification
      );
      expect(response.body.response.id).toBeDefined();
    });

    it("validate error insert user", async () => {
      const res = await supertest(app)
        .post("/api/users/create")
        .set("Authorization", `bearer ${token}`)
        .send(objectPostError);
      expect(res.status).toBeGreaterThan(200);
      expect(res.body.status).toBe(false);
    });
  });

  //#endregion

  //#region TEST GET ALL USER

  //TEST ENDPOINT  api/users/getAll
  describe("[GET] - api/users/getAll", () => {
    let response;
    beforeEach(async () => {
      response = await supertest(app)
        .get("/api/users/getAll")
        .set("Authorization", `bearer ${token}`)
        .send();
    });

    // // // validate route is ok
    it("route ok", async () => {
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    // validate array
    it("returned array", async () => {
      expect(response.body.response).toBeInstanceOf(Array);
    });
  });
  //#endregion

  //#region TEST GET USER BY ID
  describe("[GET] - api/users/getById/2", () => {
    let response;
    beforeEach(async () => {
      response = await supertest(app)
        .get("/api/users/getById/2")
        .set("Authorization", `bearer ${token}`)
        .send();
    });

    //  validate route is ok
    it("response successfull and format json", async () => {
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    // validate object response
    it("returned object user", async () => {
      expect(response.body.response).toBeInstanceOf(Object);
    });
  });

  //#endregion

  //#region TEST DELETE USER BY ID

  describe("[DELETE] - api/users/deleteById/5", () => {
    let response, user;
    beforeEach(async () => {
      user = await User.create(objectPost);
      response = await supertest(app)
        .delete(`/api/users/deleteById/${user.id}`)
        .set("Authorization", `bearer ${token}`)
        .send();
    });
    //  validate response 200
    it("response elimination successfull and format json", async () => {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.headers["content-type"]).toContain("json");
    });

    it("validate elimination db", async () => {
      expect(response.body.response.id).toBeDefined();
      const userDel = await User.findOne({
        where: { id: response.body.response.id },
      });
      expect(userDel).toBeNull();
    });
  });

  //#endregion

  //#region TEST UPDATE USER BY ID

  describe("[PUT] - api/users/update/2", () => {
    let userTest;
    beforeEach(async () => {
      userTest = await User.create(objectPost);
    });
    afterAll(async () => {
      await User.destroy({ where: { id: userTest.id } });
    });

    it("response successfull and response format json - 200", async () => {
      // request endpoint
      let response = await supertest(app)
        .put(`/api/users/update/${userTest.id}`)
        .set("Authorization", `bearer ${token}`)
        .send({
          name: "Test update",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.headers["content-type"]).toContain("json");
    });
  });

  //#endregion

  //#region TEST GET USER BY NAME
  describe("[GET] - api/users/getByName/helmer", () => {
    let response;
    beforeEach(async () => {
      response = await supertest(app)
        .get("/api/users/getByName/helmer")
        .set("Authorization", `bearer ${token}`)
        .send();
    });

    //  validate response
    it("response successfull and format json", async () => {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.headers["content-type"]).toContain("json");
    });

    // validate array response
    it("returned array of user", async () => {
      expect(response.body.response).toBeInstanceOf(Array);
    });
  });

  //#endregion
});
