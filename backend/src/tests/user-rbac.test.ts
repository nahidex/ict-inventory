import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import jwt from 'jsonwebtoken';

describe('User Management and RBAC API', () => {
    let adminToken: string;
    let userToken: string;
    let regularUser: any;

    beforeAll(async () => {
        await prisma.user.deleteMany();

        // Create an Admin user
        const admin = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@system.com',
                password: 'hashed_password',
                role: 'ADMIN'
            }
        });
        adminToken = jwt.sign({ id: admin.id, email: admin.email, role: 'ADMIN' }, process.env.JWT_SECRET || 'test_secret');

        // Create a Regular user
        regularUser = await prisma.user.create({
            data: {
                name: 'Regular User',
                email: 'user@system.com',
                password: 'hashed_password',
                role: 'USER'
            }
        });
        userToken = jwt.sign({ id: regularUser.id, email: regularUser.email, role: 'USER' }, process.env.JWT_SECRET || 'test_secret');
    });

    it('Admin should be able to list users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('Regular User should NOT be able to list users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.status).toBe(403);
    });

    it('Admin should be able to promote a user to ADMIN', async () => {
        const res = await request(app)
            .patch(`/api/users/${regularUser.id}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ role: 'ADMIN' });
        
        expect(res.status).toBe(200);
        expect(res.body.data.role).toBe('ADMIN');
    });

    it('Admin should NOT be able to delete themselves', async () => {
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        const res = await request(app)
            .delete(`/api/users/${admin?.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.status).toBe(400); 
        expect(res.body.message).toBe('Cannot delete your own account');
    });
});
