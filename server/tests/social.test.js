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

test('comment and reply', async () => {
    const login = await request(app).post('/api/auth/login').send({ email: 'riya@cu.dev', password: 'student123' });
    const token = login.body.token;
    const post = await request(app).post('/api/social').set('Authorization', `Bearer ${token}`).send({ text: 'Test post' });
    const c1 = await request(app).post(`/api/comments/post/${post.body._id}`)
        .set('Authorization', `Bearer ${token}`).send({ text: 'top' });
    const c2 = await request(app).post(`/api/comments/post/${post.body._id}`)
        .set('Authorization', `Bearer ${token}`).send({ text: 'reply', parentCommentId: c1.body._id });
    assert.equal(c2.body.parentComment, c1.body._id);
});