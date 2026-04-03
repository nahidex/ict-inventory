import request from "supertest";
import app from "../app";
import prisma from "../config/db";
import jwt from "jsonwebtoken";

describe("Activity Log API", () => {
  let token: string;
  let assetId: number;

  let branchId: number;

  beforeAll(async () => {
    // Cleanup
    await prisma.activityLog.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.maintenance.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.officer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.category.deleteMany();

    const branch = await prisma.branch.create({
      data: { name: "Log Branch", code: "LB-01", location: "Log St" },
    });
    branchId = branch.id;

    const category = await prisma.category.create({
      data: { name: "IT Equipment", code: "IT-EQ" },
    });

    // Create a user and get token
    const user = await prisma.user.create({
      data: {
        name: "Log Admin",
        email: "log@example.com",
        password: "hashed_password", // In real test would use bcrypt
      },
    });

    token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "test_secret",
    );

    // Create an asset to generate initial CREATE log
    const res = await request(app)
      .post("/api/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        assetTag: "LOG-TEST-001",
        categoryId: category.id,
        branchId: branchId,
        brand: "LogTest",
        model: "X1",
      });

    assetId = res.body.data.id;
  });

  it("should list activity logs", async () => {
    const res = await request(app)
      .get("/api/activity-logs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should generate log on asset issue", async () => {
    const officer = await prisma.officer.create({
      data: { name: "Officer For Log", branchId: branchId },
    });

    await request(app)
      .post("/api/assignments/issue")
      .set("Authorization", `Bearer ${token}`)
      .send({
        assetId,
        officerId: officer.id,
        issueDate: new Date(),
      });

    const res = await request(app)
      .get(`/api/activity-logs?assetId=${assetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const logs = res.body.data;
    expect(logs.some((l: any) => l.actionType === "ASSIGNMENT")).toBe(true);
  });

  it("should return timeline for a specific asset", async () => {
    const res = await request(app)
      .get(`/api/activity-logs/${assetId}/timeline`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.asset.assetTag).toBe("LOG-TEST-001");
    expect(res.body.timeline.length).toBeGreaterThan(1); // CREATE + ASSIGNMENT
  });
});
