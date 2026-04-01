import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import jwt from 'jsonwebtoken';

describe('Dashboard API', () => {
  let token: string;

  beforeAll(async () => {
    // Cleanup
    await prisma.activityLog.deleteMany();
    await prisma.nocClearance.deleteMany();
    await prisma.maintenance.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.officer.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: 'Dash User',
        email: 'dash@example.com',
        password: 'hashed_password',
      },
    });

    token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'test_secret');

    // Create some data
    const cat = await prisma.category.create({ data: { name: 'IT', code: 'IT-001' } });
    await prisma.asset.create({
      data: { assetTag: 'DASH-01', categoryId: cat.id, status: 'Available' }
    });
    await prisma.asset.create({
      data: { assetTag: 'DASH-02', categoryId: cat.id, status: 'Assigned' }
    });
  });

  it('should return dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.summary.assets.total).toBe(2);
    expect(res.body.summary.assets.available).toBe(1);
    expect(res.body.summary.assets.assigned).toBe(1);
    expect(res.body.categoryDistribution.length).toBeGreaterThan(0);
    expect(res.body.categoryDistribution[0].assetCount).toBe(2);
  });
});
