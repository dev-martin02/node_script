import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
function main() {}
function masin() {}

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Hello World!!!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  return res.status(500).json({
    error: 'Something broke!'
  });
});
