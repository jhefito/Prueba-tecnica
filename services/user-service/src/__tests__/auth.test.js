const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('../routes/authRoutes');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(await mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
        .post('/api/auth/register')
        .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
});

it('should login a user', async () => {
    // First register a user
    await request(app)
    .post('/api/auth/register')
    .send({
        username: 'logintest',
        email: 'login@example.com',
        password: 'password123'
    });

    // Then try to login
    const res = await request(app)
    .post('/api/auth/login')
    .send({
        email: 'login@example.com',
        password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
});
});