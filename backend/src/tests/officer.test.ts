import request from "supertest";
import app from "../app";
import prisma from "../config/db";

describe("Officer Endpoints", () => {
  let token: string;

  let branchId: number;

  beforeAll(async () => {
    // Cleanup
    await prisma.assignment.deleteMany();
    await prisma.officer.deleteMany();
    await prisma.branch.deleteMany();

    const branch = await prisma.branch.create({
      data: {
        name: "Operation Branch",
        code: "OB-01",
        location: "Test Location",
      },
    });
    branchId = branch.id;

    // Register & Login
    const email = `off_test_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "Officer Tester",
      email: email,
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: email,
      password: "password123",
    });
    token = res.body.token;
  });

  describe("POST /api/officers", () => {
    it("should create a new officer", async () => {
      const res = await request(app)
        .post("/api/officers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Doe",
          designation: "Manager",
          department: "IT",
          phone: "01711111111",
          email: "john@example.com",
          branchId: branchId,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("John Doe");
      expect(res.body.data.email).toBe("john@example.com");
    });

    it("should fail without officer name", async () => {
      const res = await request(app)
        .post("/api/officers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          designation: "Manager",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Officer name is required");
    });
  });

  describe("GET /api/officers", () => {
    it("should return paginated officers", async () => {
      const res = await request(app)
        .get("/api/officers?page=1&limit=10")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBeGreaterThan(0);
    });
  });

  describe("GET /api/officers/:id", () => {
    it("should return a single officer by ID", async () => {
      const officer = await prisma.officer.findFirst();
      const res = await request(app)
        .get(`/api/officers/${officer!.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(officer!.id);
      expect(res.body).toHaveProperty("assignments");
    });

    it("should return 404 for non-existent officer", async () => {
      const res = await request(app)
        .get("/api/officers/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/officers/:id", () => {
    it("should update officer details", async () => {
      const officer = await prisma.officer.findFirst();
      const res = await request(app)
        .patch(`/api/officers/${officer!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Updated",
          isActive: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("John Updated");
      expect(res.body.data.isActive).toBe(false);
    });
  });

  describe("DELETE /api/officers/:id", () => {
    it("should delete an officer", async () => {
      const officer = await prisma.officer.create({
        data: { name: "Delete Me" },
      });
      const res = await request(app)
        .delete(`/api/officers/${officer.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Officer deleted successfully");
    });

    it("should fail if officer has assignments", async () => {
      // Note: Full assignment logic would be needed here,
      // but for this test we'll create an assignment record directly
      const officer = await prisma.officer.create({
        data: { name: "Assigned Officer" },
      });

      // Create a category and asset for assignment
      const cat = await prisma.category.create({
        data: { name: "AssignTest", code: "ATC" },
      });
      const asset = await (prisma.asset as any).create({
        data: {
          assetTag: "OFF-DEL-01",
          categoryId: cat.id,
          status: "Available",
        },
      });

      await (prisma.assignment as any).create({
        data: {
          assetId: asset.id,
          officerId: officer.id,
          issueDate: new Date(),
        },
      });

      const res = await request(app)
        .delete(`/api/officers/${officer.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("assignments");
    });
  });
});
