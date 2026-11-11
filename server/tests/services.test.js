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

test('proposal + accept flow', async () => {
    const arjunLogin = await request(app).post('/api/auth/login').send({ email: 'arjun@cu.dev', password: 'student123' });
    const riyaLogin = await request(app).post('/api/auth/login').send({ email: 'riya@cu.dev', password: 'student123' });
    const arjunToken = arjunLogin.body.token;
    const riyaToken = riyaLogin.body.token;

    const list = await request(app).get('/api/services/requests?status=open').set('Authorization', `Bearer ${arjunToken}`);
    const requestId = list.body.items[0]?._id;
    if (!requestId) return;

    const proposal = await request(app).post(`/api/proposals/request/${requestId}`)
        .set('Authorization', `Bearer ${riyaToken}`).send({ price: 1800, deliveryDays: 5 });
    assert.equal(proposal.status, 201);

    const accepted = await request(app).patch(`/api/proposals/${proposal.body._id}/accept`)
        .set('Authorization', `Bearer ${arjunToken}`);
    assert.equal(accepted.status, 200);
});