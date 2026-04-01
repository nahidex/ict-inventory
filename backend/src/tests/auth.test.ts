import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test user',
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
  };

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_' } },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should fail if email already exists', async () => {
      // First registration
      const existingEmail = `existing_${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: existingEmail });

      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: existingEmail });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Incomplete User' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide all fields');
    });
  });

  describe('POST /api/auth/login', () => {
    const loginUser = {
      name: 'Login user',
      email: `login_${Date.now()}@example.com`,
      password: 'password123',
    };

    beforeAll(async () => {
      // Register the user first
      await request(app)
        .post('/api/auth/register')
        .send(loginUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email,
          password: loginUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(loginUser.email);
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;
    const testUser = {
      name: 'Me Person',
      email: `me_${Date.now()}@example.com`,
      password: 'password123',
    };

    beforeAll(async () => {
      // Register
      await request(app).post('/api/auth/register').send(testUser);
      // Login to get token
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      token = res.body.token;
    });

    it('should return user details with a valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.name).toBe(testUser.name);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail with no token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid or expired token');
    });
  });

  describe('POST /api/auth/logout', () => {
    let logoutToken: string;

    beforeAll(async () => {
      const email = `logout_${Date.now()}@example.com`;
      // Register
      await request(app).post('/api/auth/register').send({
        name: 'Logout User',
        email: email,
        password: 'password123',
      });
      // Login to get token
      const res = await request(app).post('/api/auth/login').send({
        email: email,
        password: 'password123',
      });
      logoutToken = res.body.token;
    });

    it('should return success message on logout', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${logoutToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });

    it('should fail to logout without token', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });
  });
});
