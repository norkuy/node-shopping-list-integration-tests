const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function() {
    before(function() {
      return runServer();
    });
  
    it("should list recipes on GET", function() {
      return chai
        .request(app)
        .get("/recipes")
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("array");
  
          expect(res.body.length).to.be.at.least(1);
          const expectedKeys = ["name", "id", "ingredients"];
          res.body.forEach(function(item) {
            expect(item).to.be.a("object");
            expect(item).to.include.keys(expectedKeys);
          });
        });
    });
  
    it("should add a recipe on POST", function() {
      const item = {
        name: "ham sandwich",
        ingredients: ["bread", "ham", "cheese", "mayo", "pickle"]
      };
      return chai
        .request(app)
        .post("/recipes")
        .send(item)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res).to.be.a("object");
          expect(res.body).to.include.keys("name", "ingredients", "id");
          expect(res.body.id).to.not.equal(null);
          expect(res.body).to.deep.equal(
            Object.assign(item, { id: res.body.id })
          );
        });
    });
  
    it("should update a recipe on PUT", function() {
      return chai
        .request(app)
        .get("/recipes")
        .then(function(res) {
          const id = res.body[0].id;
          return chai
            .request(app)
            .put(`/recipes/${id}`)
            .send({
              id,
              name: "chocolate milk",
              ingredients: ["milk", "chocolate syrup", "sugar"]
            });
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });
  
    it("should delete a recipe on DELETE", function() {
      return chai
        .request(app)
        .get("/recipes")
        .then(function(res) {
          return chai.request(app).delete(`/recipes/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });
  
    after(function() {
      return closeServer();
    });
  });
  