const PostController = require('../controllers/posts');
let server;
const request = require('supertest');
const { before } = require("cheerio/lib/api/manipulation");
const Util = require('../utils/utilities');
const token = Util.generateToken("test@gmail.com", "60d7070b1aa1833ac840cc25", "default");
const TestUtils = require("./util");

describe("Posts", () => {
    beforeEach( () => {
        server = require("../../server");
    });
    afterEach( () => {
        server.close();
    })

    describe("/auth", () => {
        it("User gets logged in", async () => {
            const result = await request(server)
            .post("/api/user/login")
            .set('Accept', 'application/json')
            .send({ email: "test@gmail.com", password: "test" });
            expect(result.status).toBe(200);
        });
    });

    describe("/posts/", () => {
        it("Should return 401 for unloggedIn users", async () => {
            const result = await request(server).get("/api/posts/");
            expect(result.status).toBe(401);
        });

        it("Should return 200 for loggedIn users", async () => {
            const result = await request(server)
            .get("/api/posts/")
            .set('Authorization', "Bearer " + token);
            expect(result.status).toBe(200);
        });

        it("Should return 500 if a post is not created", async () => {
            const result = await request(server)
            .post("/api/posts/")
            .send(TestUtils.tests[0]);
            expect(result.status).toBe(401);
        });
    });

    describe("/problems", () => {
        it("Get Problems", async () => {
            const result = await request(server)
            .get("/api/problems")
            expect(result.status).toBe(200);
        });
    });

    describe("/problems", () => {
        it("Get Problems", async () => {
            const result = await request(server)
            .get("/api/random")
            expect(result.status).toBe(200);
        });
    });
})
