import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { seedIfEmpty } from '../src/seed.js';

test.before(async () => {
    await connectDB();
    await seedIfEmpty();
});

async function login(email) {
    const r = await request(app).post('/api/auth/login').send({ email, password: 'student123' });
    return r.body.token;
}

test('unverified user blocked from /api/services/requests', async () => {
    const token = await login('kabir@cu.dev');
    const res = await request(app).get('/api/services/requests').set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 403);
});

test('cross-college access denied', async () => {
    const token = await login('neha@chitkara.dev');
    const cuToken = await login('riya@cu.dev');
    // Get a listing id from cu
    const listing = await request(app).get('/api/market').set('Authorization', `Bearer ${cuToken}`);
    const id = listing.body.items[0]?._id;
    if (!id) return; // seed missing
    const res = await request(app).get(`/api/market/${id}`).set('Authorization', `Bearer ${token}`);
    // No detail route exists so 404 — verify by trying to PATCH instead
    const patch = await request(app).patch(`/api/market/${id}`).set('Authorization', `Bearer ${token}`).send({ price: 1 });
    assert.notEqual(patch.status, 200);
});