import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Category Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    // Cleanup
    await prisma.asset.deleteMany();
    await prisma.category.deleteMany();

    // Register & Login
    const email = `cat_test_${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      name: 'Cat Tester',
      email: email,
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: email,
      password: 'password123',
    });
    token = res.body.token;
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Laptops', code: 'LAP' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Laptops');
      expect(res.body.data.code).toBe('LAP');
    });

    it('should fail with duplicate code', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Other Laptops', code: 'LAP' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('exists');
    });
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update category name', async () => {
      const cat = await prisma.category.findFirst({ where: { code: 'LAP' } });
      const res = await request(app)
        .patch(`/api/categories/${cat!.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Notebooks' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Notebooks');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const cat = await prisma.category.findFirst({ where: { code: 'LAP' } });
      const res = await request(app)
        .delete(`/api/categories/${cat!.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Category deleted successfully');
    });

    it('should fail if category has assets', async () => {
      // Create a category and an asset
      const cat = await prisma.category.create({ data: { name: 'Locked', code: 'LCK' } });
      await (prisma.asset as any).create({
        data: {
          assetTag: 'LOCK-01',
          categoryId: cat.id,
          status: 'Available'
        }
      });

      const res = await request(app)
        .delete(`/api/categories/${cat.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('associated assets');
    });
  });
});
