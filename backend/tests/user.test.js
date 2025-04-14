import request from 'supertest';
import app from '../index.js'; 
import mongoose from 'mongoose';
import User from '../api/user/userModel.js';

let adminToken;
let managerToken;
let createdUserId;

beforeAll(async () => {
  
  // Clean 
  await User.deleteMany({ email: /@example\.com$/ });

  // Register Admin
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'admin',
    });

  // Register Manager
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Manager',
      email: 'manager@example.com',
      password: 'managerpass',
      role: 'manager',
    });

  // Login as Admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'adminpass' });

  adminToken = adminRes.body.token;

  // Login as Manager
  const managerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'manager@example.com', password: 'managerpass' });

  managerToken = managerRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API Tests', () => {
  test('Admin can create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Player One',
        email: 'player1@example.com',
        password: 'playerpass',
        role: 'player',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Player One');
    createdUserId = res.body._id;
  });

  test('Manager cannot access admin-only route (GET all users)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/access denied/i);
  });

  test('Admin can fetch all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('Manager can fetch own user profile', async () => {
    const profileRes = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${managerToken}`);

    // Decode manager ID from JWT 
    const jwtPayload = JSON.parse(
        Buffer.from(managerToken.split('.')[1], 'base64').toString()
    );
    const managerId = jwtPayload.id;
    
    const res = await request(app)
        .get(`/api/users/${managerId}`)
        .set('Authorization', `Bearer ${managerToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('manager@example.com');  
  });

  test('User cannot delete another user unless admin', async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('Admin can delete user', async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });
});
