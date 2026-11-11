import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedIfEmpty } from '../src/seed.js';

test.before(async () => {
    await connectDB();
    await seedIfEmpty();
});
test.after(async () => {
    await disconnectDB();
});

test('login works', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'riya@cu.dev', password: 'student123' });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
});

test('duplicate registration rejected', async () => {
    const res = await request(app).post('/api/auth/register').send({
        name: 'Dup', email: 'riya@cu.dev', password: 'x123456',
        collegeId: '000000000000000000000000',
    });
    assert.ok([400, 409].includes(res.status));
});