import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Assignment Endpoints', () => {
  let token: string;
  let assetId: number;
  let officerId: number;

  beforeAll(async () => {
    // Cleanup
    await prisma.activityLog.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.officer.deleteMany();
    await prisma.category.deleteMany();

    // Setup Category & Asset
    const cat = await prisma.category.create({ data: { name: 'Device', code: 'DEV' } });
    const asset = await (prisma.asset as any).create({
      data: {
        assetTag: 'AST-ISSUE-01',
        categoryId: cat.id,
        status: 'Available'
      }
    });
    assetId = asset.id;

    // Setup Officer
    const officer = await prisma.officer.create({ data: { name: 'Recipient Officer' } });
    officerId = officer.id;

    // Register & Login
    const email = `assign_test_${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Assign Tester',
      email: email,
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: email,
      password: 'password123',
    });
    token = res.body.token;
  });

  describe('POST /api/assignments/issue', () => {
    it('should issue an asset to an officer', async () => {
      const res = await request(app)
        .post('/api/assignments/issue')
        .set('Authorization', `Bearer ${token}`)
        .send({
          assetId,
          officerId,
          issueDate: '2026-03-31',
          comments: 'Initial issue'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Asset assigned successfully');

      // Check asset status updated
      const updatedAsset = await prisma.asset.findUnique({ where: { id: assetId } });
      expect(updatedAsset?.status).toBe('Assigned');
    });

    it('should fail if asset is already assigned', async () => {
      const res = await request(app)
        .post('/api/assignments/issue')
        .set('Authorization', `Bearer ${token}`)
        .send({
          assetId,
          officerId,
          issueDate: '2026-03-31'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not available');
    });
  });

  describe('POST /api/assignments/return/:id', () => {
    it('should return an asset', async () => {
      const assignment = await prisma.assignment.findFirst({
        where: { assetId }
      });

      const res = await request(app)
        .post(`/api/assignments/return/${assignment!.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          actualReturnDate: '2026-04-01',
          returnCondition: 'Good condition'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Asset returned successfully');

      // Check asset status reset to Available
      const returnedAsset = await prisma.asset.findUnique({ where: { id: assetId } });
      expect(returnedAsset?.status).toBe('Available');
    });

    it('should fail if already returned', async () => {
      const assignment = await prisma.assignment.findFirst({
        where: { assetId }
      });

      const res = await request(app)
        .post(`/api/assignments/return/${assignment!.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already been returned');
    });
  });

  describe('GET /api/assignments/active/:officerId', () => {
    it('should return active assignments for an officer', async () => {
      const res = await request(app)
        .get(`/api/assignments/active/${officerId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // We had 1 assignment which was returned in previous test, 
      // so active might be 0 unless we create another active one
      expect(res.body.every((a: any) => a.actualReturnDate === null)).toBe(true);
    });

    it('should show 0 active after return', async () => {
      const res = await request(app)
        .get(`/api/assignments/active/${officerId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });
});
