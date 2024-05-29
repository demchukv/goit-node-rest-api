import request from 'supertest';
import app from '../app'; // Шлях до вашого файлу app.js

describe('POST /login', () => {
  it('should login user and return token', async () => {
    const userData = {
      email: 'user@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/login')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({
      email: userData.email,
      subscription: 'starter', // або інший тип підписки, який очікується
    });
  });

  it('should return 401 for invalid credentials', async () => {
    const userData = {
      email: 'user@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/login')
      .send(userData);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Email or password is wrong');
  });
});
