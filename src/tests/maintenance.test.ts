import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Maintenance Endpoints', () => {
  let token: string;
  let assetId: number;

  beforeAll(async () => {
    // Cleanup
    await prisma.activityLog.deleteMany();
    await prisma.maintenance.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.category.deleteMany();

    // Setup Category & Asset
    const cat = await prisma.category.create({ data: { name: 'IT Equipment', code: 'IT' } });
    const asset = await (prisma.asset as any).create({
      data: {
        assetTag: 'MAINT-AST-01',
        categoryId: cat.id,
        status: 'Available'
      }
    });
    assetId = asset.id;

    // Register & Login
    const email = `maint_test_${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Maint Tester',
      email: email,
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: email,
      password: 'password123',
    });
    token = res.body.token;
  });

  describe('POST /api/maintenance/send', () => {
    it('should send an asset to maintenance', async () => {
      const res = await request(app)
        .post('/api/maintenance/send')
        .set('Authorization', `Bearer ${token}`)
        .send({
          assetId,
          issueDescription: 'Broken Screen',
          vendorName: 'Repair Shop Inc.'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Asset sent to maintenance successfully');

      // Check asset status updated
      const updatedAsset = await prisma.asset.findUnique({ where: { id: assetId } });
      // Map back Under_Repair from the enum if needed, based on current prisma setup
      expect(updatedAsset?.status).toBe('Under_Repair');
    });

    it('should fail if asset is already under repair', async () => {
      const res = await request(app)
        .post('/api/maintenance/send')
        .set('Authorization', `Bearer ${token}`)
        .send({
          assetId,
          issueDescription: 'Battery failure'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already under repair');
    });
  });

  describe('PUT /api/maintenance/receive/:id', () => {
    it('should receive an asset from maintenance', async () => {
      const maintenance = await prisma.maintenance.findFirst({
        where: { assetId }
      });

      const res = await request(app)
        .put(`/api/maintenance/receive/${maintenance!.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          repairCost: 1500,
          repairStatus: 'Completed'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Asset received from maintenance successfully');

      // Check asset status reset to Available
      const returnedAsset = await prisma.asset.findUnique({ where: { id: assetId } });
      expect(returnedAsset?.status).toBe('Available');
    });
  });

  describe('GET /api/maintenance/history/:assetId', () => {
    it('should return maintenance history for an asset', async () => {
      const res = await request(app)
        .get(`/api/maintenance/history/${assetId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].assetId).toBe(assetId);
    });
  });
});
