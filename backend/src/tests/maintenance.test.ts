import request from "supertest";
import app from "../app";
import prisma from "../config/db";

describe("Maintenance Endpoints", () => {
  let token: string;
  let assetId: number;

  beforeAll(async () => {
    // Cleanup
    await prisma.activityLog.deleteMany();
    await prisma.maintenance.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.category.deleteMany();
    await prisma.branch.deleteMany();

    // Setup Branch
    const branch = await prisma.branch.create({
      data: { name: "Repair HQ", code: "RHQ-01", location: "Tech Lane" },
    });

    // Setup Category & Asset
    const cat = await prisma.category.create({
      data: { name: "IT Equipment", code: "IT" },
    });
    const asset = await prisma.asset.create({
      data: {
        assetTag: "MAINT-AST-01",
        categoryId: cat.id,
        branchId: branch.id,
        status: "Available",
      },
    });
    assetId = asset.id;

    // Register & Login
    const email = `maint_test_${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "Maint Tester",
      email: email,
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: email,
      password: "password123",
    });
    token = res.body.token;
  });

  describe("POST /api/maintenance/request", () => {
    it("should create a maintenance request and update asset status to Under_Repair", async () => {
      const maintenanceData = {
        assetId: assetId,
        issueDescription: "Laptop screen flickering (New Req)",
        vendorDetails: "Apple Care BD",
        startDate: "2026-04-05"
      };

      const res = await request(app)
        .post("/api/maintenance/request")
        .set("Authorization", `Bearer ${token}`)
        .send(maintenanceData);

      expect(res.status).toBe(201);
      expect(res.body.message).toContain("সফলভাবে মেরামত রিকোয়েস্ট তৈরি করা হয়েছে");
      expect(res.body.data.assetId).toBe(assetId);
      expect(res.body.data.status).toBe("Pending");

      // চেক করা যে আসল অ্যাসেট স্ট্যাটাস আপডেট হয়েছে কি না
      const updatedAsset = await prisma.asset.findUnique({
        where: { id: assetId }
      });
      expect(updatedAsset?.status).toBe("Under_Repair");
    });

    it("should return error if asset is already under repair", async () => {
      const maintenanceData = {
        assetId: assetId,
        issueDescription: "Another issue",
      };

      const res = await request(app)
        .post("/api/maintenance/request")
        .set("Authorization", `Bearer ${token}`)
        .send(maintenanceData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("ইতিমধ্যে মেরামতের তালিকায় রয়েছে");
    });
  });

  describe("POST /api/maintenance/send", () => {
    it("should send an asset to maintenance", async () => {
      // প্রথমে স্ট্যাটাস আবার Available করে নিচ্ছি কারণ আগের টেস্টে এটা Under_Repair হয়ে গেছে
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: "Available" }
      });

      const res = await request(app)
        .post("/api/maintenance/send")
        .set("Authorization", `Bearer ${token}`)
        .send({
          assetId,
          issueDescription: "Broken Screen",
          vendorDetails: "Repair Shop Inc.",
          startDate: "2026-04-05"
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Asset sent to maintenance successfully");

      // Check asset status updated
      const updatedAsset = await prisma.asset.findUnique({
        where: { id: assetId },
      });
      // Map back Under_Repair from the enum if needed, based on current prisma setup
      expect(updatedAsset?.status).toBe("Under_Repair");
    });

    it("should fail if asset is already under repair", async () => {
      const res = await request(app)
        .post("/api/maintenance/send")
        .set("Authorization", `Bearer ${token}`)
        .send({
          assetId,
          issueDescription: "Battery failure",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already under repair");
    });
  });

  describe("PUT /api/maintenance/receive/:id", () => {
    it("should receive an asset and return to officer (ASSIGNED)", async () => {
      // প্রথমে চেক করা যে অ্যাসেটের একজন অফিসার আছে
      await prisma.asset.update({
        where: { id: assetId },
        data: { currentOfficerId: 1, status: "Under_Repair" } // ধরে নিচ্ছি আইডি ১ এর একজন অফিসার আছে
      });

      const maintenance = await prisma.maintenance.findFirst({
        where: { assetId },
        orderBy: { id: 'desc' }
      });

      const res = await request(app)
        .put(`/api/maintenance/receive/${maintenance!.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          repairCost: 500,
          status: "Completed",
          returnToOfficer: true
        });

      expect(res.status).toBe(200);
      const updatedAsset = await prisma.asset.findUnique({ where: { id: assetId } });
      expect(updatedAsset?.status).toBe("Assigned");
      expect(updatedAsset?.currentOfficerId).not.toBeNull();
    });

    it("should receive an asset to store (AVAILABLE) and clear current officer", async () => {
      // অ্যাসেট আবার মেরামত তালিকায় নিচ্ছি
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: "Under_Repair" }
      });
      
      const maintenance = await prisma.maintenance.create({
        data: {
          assetId,
          issueDescription: "Store test",
          status: "Pending"
        }
      });

      const res = await request(app)
        .put(`/api/maintenance/receive/${maintenance.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          repairCost: 200,
          status: "Completed",
          returnToOfficer: false
        });

      expect(res.status).toBe(200);
      const updatedAsset = await prisma.asset.findUnique({ where: { id: assetId } });
      expect(updatedAsset?.status).toBe("Available");
      expect(updatedAsset?.currentOfficerId).toBeNull();
    });
  });

  describe("GET /api/maintenance/history/:assetId", () => {
    it("should return maintenance history for an asset", async () => {
      const res = await request(app)
        .get(`/api/maintenance/history/${assetId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].assetId).toBe(assetId);
    });
  });
});
