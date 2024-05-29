// login.test.js
import { login } from '../controllers/usersControllers.js';
// const { login } = require('../controllers/usersControllers.js'); // Замініть шлях на свій
// import { findUser } from '../services/usersServices.js';
// const { findUser } = require('../services/usersServices.js'); // Замініть шлях на свій

jest.mock('../services/schemas/user.js', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe('login function', () => {
  it('should return a token when valid email and password are provided', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'secret',
      },
    };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };

    // Мокуємо функцію findUser
    const mockUser = {
      _id: 'someUserId',
      email: 'test@example.com',
      validPassword: jest.fn(() => true),
    };
    User.findOne.mockResolvedValue(mockUser);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
      user: expect.objectContaining({
        email: 'test@example.com',
        subscription: expect.any(String),
      }),
    });
  });

  it('should return 401 if invalid email or password is provided', async () => {
    const req = {
      body: {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      },
    };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };

    // Мокуємо функцію findUser, щоб повернути null
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email or password is wrong',
    });
  });
});
