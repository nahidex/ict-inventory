import request from "supertest";
import app from "../app";
import prisma from "../config/db";

describe("NOC Endpoints", () => {
  let token: string;
  let officerId: number;
  let assetId: number;

  beforeAll(async () => {
    // Cleanup
    await prisma.nocClearance.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.officer.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.category.deleteMany();
    await prisma.branch.deleteMany();

    // Setup Branch
    const branch = await prisma.branch.create({
      data: { name: "NOC Branch", code: "NB-01", location: "NOC St" },
    });

    // Setup Setup
    const cat = await prisma.category.create({
      data: { name: "IT", code: "IT" },
    });
    const officer = await prisma.officer.create({
      data: { name: "Jane NOC", branchId: branch.id },
    });
    officerId = officer.id;
    const asset = await prisma.asset.create({
      data: {
        assetTag: "NOC-AST-01",
        categoryId: cat.id,
        branchId: branch.id,
        status: "Available",
      },
    });
    assetId = asset.id;

    // Login for token
    const email = `noc_test_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "NOC Tester",
      email: email,
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: email,
      password: "password123",
    });
    token = res.body.token;
  });

  describe("Clearance Check & NOC Process", () => {
    it("should show officer is clear initially", async () => {
      const res = await request(app)
        .get(`/api/officers/${officerId}/clearance-check`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.isClear).toBe(true);
    });

    it("should show officer NOT clear after assignment", async () => {
      // Assign asset
      await (prisma.assignment as any).create({
        data: { assetId, officerId, issueDate: new Date() },
      });
      await (prisma.asset as any).update({
        where: { id: assetId },
        data: { status: "Assigned" },
      });

      const res = await request(app)
        .get(`/api/officers/${officerId}/clearance-check`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.isClear).toBe(false);
      expect(res.body.pendingAssetsCount).toBe(1);
    });

    it("should fail NOC application if not clear", async () => {
      const res = await request(app)
        .post("/api/noc/apply")
        .set("Authorization", `Bearer ${token}`)
        .send({ officerId });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("pending assets");
    });

    it("should allow NOC application after returning assets", async () => {
      // Return asset
      const assignment = await prisma.assignment.findFirst({
        where: { officerId, actualReturnDate: null },
      });
      await (prisma.assignment as any).update({
        where: { id: assignment!.id },
        data: { actualReturnDate: new Date() },
      });
      await (prisma.asset as any).update({
        where: { id: assetId },
        data: { status: "Available" },
      });

      // Apply
      const res = await request(app)
        .post("/api/noc/apply")
        .set("Authorization", `Bearer ${token}`)
        .send({ officerId, remarks: "Retirement" });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe("Pending");
    });

    it("should approve a pending NOC", async () => {
      const noc = await prisma.nocClearance.findFirst({ where: { officerId } });
      const res = await request(app)
        .put(`/api/noc/approve/${noc!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "Approved", remarks: "All clear" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("Approved");
    });
  });
});
