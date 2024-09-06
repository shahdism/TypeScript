import express, { Request, Response } from 'express';
import os from 'os';

const app = express();
const port = 4001;  

app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
    const name = req.query.name as string || 'World';
    res.json({ greeting: `Hello, ${name}` });
});

app.get('/info', (req: Request, res: Response) => {
    const requestTime = new Date().toISOString();
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const hostName = os.hostname();
    const headers = req.headers;

    res.json({
        time: requestTime,
        client_address: clientIp,
        host_name: hostName,
        headers: headers
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
