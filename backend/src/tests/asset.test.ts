import request from "supertest";
import app from "../app";
import prisma from "../config/db";

describe("Asset Endpoints", () => {
  let token: string;

  beforeAll(async () => {
    // Clean database or ensure a category exists
    await prisma.asset.deleteMany();
    await prisma.category.deleteMany();
    await prisma.branch.deleteMany();

    const branch = await prisma.branch.create({
      data: {
        name: "Main Branch",
        code: "MB-001",
        location: "123 Main St",
      },
    });

    const category = await prisma.category.create({
      data: {
        name: "Electronics",
        code: "ELEC",
      },
    });

    // Create some sample assets
    await prisma.asset.createMany({
      data: [
        {
          assetTag: "AST-001",
          categoryId: category.id,
          branchId: branch.id,
          status: "Available",
          serialNumber: "SN001",
        },
        {
          assetTag: "AST-002",
          categoryId: category.id,
          branchId: branch.id,
          status: "Available",
          serialNumber: "SN002",
        },
        {
          assetTag: "AST-003",
          categoryId: category.id,
          branchId: branch.id,
          status: "Assigned",
          serialNumber: "SN003",
        },
      ],
    });

    // Register and login to get token
    const email = `asset_test_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "Asset Tester",
      email: email,
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: email,
      password: "password123",
    });
    token = res.body.token;
  });

  describe("GET /api/assets", () => {
    it("should return paginated assets with valid token", async () => {
      const res = await request(app)
        .get("/api/assets?page=1&limit=2")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.total).toBe(3);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(2);
      expect(res.body.meta.totalPages).toBe(2);
    });

    it("should return second page of assets", async () => {
      const res = await request(app)
        .get("/api/assets?page=2&limit=2")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.meta.page).toBe(2);
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/assets");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/assets/:id", () => {
    let assetId: number;

    beforeAll(async () => {
      const asset = await prisma.asset.findFirst();
      if (asset) assetId = asset.id;
    });

    it("should return a single asset by id", async () => {
      const res = await request(app)
        .get(`/api/assets/${assetId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(assetId);
      expect(res.body).toHaveProperty("assetTag");
      expect(res.body).toHaveProperty("category");
    });

    it("should return 404 if asset not found", async () => {
      const res = await request(app)
        .get("/api/assets/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Asset not found");
    });

    it("should fail without token", async () => {
      const res = await request(app).get(`/api/assets/${assetId}`);
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/assets", () => {
    let categoryId: number;
    let branchId: number;

    beforeAll(async () => {
      const category = await prisma.category.findFirst();
      if (category) categoryId = category.id;
      const branch = await prisma.branch.findFirst();
      if (branch) branchId = branch.id;
    });

    it("should create a new asset with valid data", async () => {
      const res = await request(app)
        .post("/api/assets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          assetTag: "AST-TEST-101",
          categoryId: categoryId,
          branchId: branchId,
          brand: "test-brand",
          model: "test-model",
          serialNumber: "SN-TEST-101",
          purchaseDate: "2026-03-31",
          purchaseSource: "Budget",
          status: "Available",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.assetTag).toBe("AST-TEST-101");
      expect(res.body.data.serialNumber).toBe("SN-TEST-101");
    });

    it("should fail to create duplicate assetTag", async () => {
      const res = await request(app)
        .post("/api/assets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          assetTag: "AST-TEST-101", // duplicate tag
          serialNumber: "SN-UNIQUE-999",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("exists");
    });

    it("should fail without assetTag", async () => {
      const res = await request(app)
        .post("/api/assets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          serialNumber: "SN-TEST-NOMARK",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Asset tag is required");
    });

    it("should fail without token", async () => {
      const res = await request(app).post("/api/assets").send({
        assetTag: "AST-NO-TOKEN",
      });
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/assets/:id", () => {
    let assetId: number;

    beforeAll(async () => {
      const asset = await prisma.asset.findFirst({
        where: { assetTag: "AST-TEST-101" },
      });
      if (asset) assetId = asset.id;
    });

    it("should update asset details", async () => {
      const res = await request(app)
        .patch(`/api/assets/${assetId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          brand: "Updated Brand",
          status: "Assigned",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.brand).toBe("Updated Brand");
      expect(res.body.data.status).toBe("Assigned");
    });

    it("should return 404 if asset to update not found", async () => {
      const res = await request(app)
        .patch("/api/assets/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ brand: "Does not matter" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/assets/:id", () => {
    let assetIdToDelete: number;

    beforeAll(async () => {
      const asset = await prisma.asset.findFirst({
        where: { assetTag: "AST-TEST-101" },
      });
      if (asset) assetIdToDelete = asset.id;
    });

    it("should delete an asset", async () => {
      const res = await request(app)
        .delete(`/api/assets/${assetIdToDelete}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Asset deleted successfully");

      const checkAsset = await prisma.asset.findUnique({
        where: { id: assetIdToDelete },
      });
      expect(checkAsset).toBeNull();
    });

    it("should return 404 if asset to delete not found", async () => {
      const res = await request(app)
        .delete("/api/assets/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
