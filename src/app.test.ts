import request from 'supertest';  // Import supertest to simulate requests
import express from 'express';    // Import your app
import os from 'os';              // For mocking os functions (if needed)

// Mocking the os.hostname() if you want to control the output
jest.mock('os', () => ({
  hostname: jest.fn(() => 'mocked-hostname'),
}));

// The same app you defined in your original code
const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
  const name = req.query.name as string || 'World';
  res.json({ greeting: `Hello, ${name}` });
});

app.get('/info', (req, res) => {
  const requestTime = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const hostName = os.hostname();
  const headers = req.headers;

  res.json({
    time: requestTime,
    client_address: clientIp,
    host_name: hostName,
    headers: headers,
  });
});

describe('Test Express Routes', () => {
  it('should return a greeting on /hello', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ greeting: 'Hello, World' });
  });

  it('should return a custom greeting with a name on /hello', async () => {
    const res = await request(app).get('/hello?name=John');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ greeting: 'Hello, John' });
  });

  it('should return system information on /info', async () => {
    const res = await request(app).get('/info');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('time');
    expect(res.body).toHaveProperty('client_address');
    expect(res.body).toHaveProperty('host_name', 'mocked-hostname');
    expect(res.body).toHaveProperty('headers');
  });
});
