import request from "supertest";
import app from "../app";
import prisma from "../config/db";

describe("Branch Endpoints", () => {
  let token: string;
  let testUserEmail: string;

  beforeAll(async () => {
    // Cleanup existing test data if any
    await prisma.asset.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.user.deleteMany();

    // Register & Login to get token
    testUserEmail = `branch_tester_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "Branch Tester",
      email: testUserEmail,
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: "password123",
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/branches", () => {
    it("should create a new branch", async () => {
      const res = await request(app)
        .post("/api/branches")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "ICT Department",
          code: "ICT_DEPT",
          location: "5th Floor",
          roomNumber: "505",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("ICT Department");
      expect(res.body.data.code).toBe("ICT_DEPT");
    });

    it("should return 400 for duplicate branch code", async () => {
      const res = await request(app)
        .post("/api/branches")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Another ICT",
          code: "ICT_DEPT",
          location: "6th Floor",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already exists");
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/api/branches")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "No Code Branch",
          // code and location missing
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/branches", () => {
    it("should return a list of branches", async () => {
      const res = await request(app)
        .get("/api/branches")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((b: any) => b.code === "ICT_DEPT")).toBe(true);
    });
  });

  describe("PATCH /api/branches/:id", () => {
    it("should update branch details", async () => {
      const branch = await prisma.branch.findUnique({
        where: { code: "ICT_DEPT" },
      });
      const res = await request(app)
        .patch(`/api/branches/${branch!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "ICT & Telecom",
          roomNumber: "505A",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("ICT & Telecom");
      expect(res.body.data.roomNumber).toBe("505A");
    });

    it("should return 404 for non-existent branch", async () => {
      const res = await request(app)
        .patch("/api/branches/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Ghost" });

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/branches/:id/assets", () => {
    it("should return assets for a specific branch", async () => {
      const branch = await prisma.branch.findUnique({
        where: { code: "ICT_DEPT" },
      });

      // Create a dummy category and asset for this branch
      const category = await prisma.category.create({
        data: { name: "Test Category", code: `TCT_${Date.now()}` },
      });

      await prisma.asset.create({
        data: {
          assetTag: `TAG_${Date.now()}`,
          categoryId: category.id,
          branchId: branch!.id,
          brand: "Dell",
          status: "Available",
        },
      });

      const res = await request(app)
        .get(`/api/branches/${branch!.id}/assets`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.branchCode).toBe("ICT_DEPT");
      expect(Array.isArray(res.body.assets)).toBe(true);
      expect(res.body.assets.length).toBeGreaterThan(0);
    });
  });
});
