import http, { IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Types & Interfaces
interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// 2. ESM Setup for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'tasks.json');

// 3. EventEmitter for Task Tracking
const taskEmitter = new EventEmitter();

taskEmitter.on('taskCreated', (task: Task) => {
  console.log(`[EVENT]: Task Created - ID: ${task.id}, Title: ${task.title}`);
});

// 4. Initialize JSON file if it doesn't exist
const initDb = async (): Promise<void> => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
};

// 5. Helper to read/write tasks
const getTasks = async (): Promise<Task[]> => {
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content);
};

const saveTasks = async (tasks: Task[]): Promise<void> => {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// 6. Creating the Server (Native HTTP)
const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  // Set default response headers
  res.setHeader('Content-Type', 'application/json');

  try {
    // --- ROUTE: GET /tasks ---
    if (url === '/tasks' && method === 'GET') {
      const tasks = await getTasks();
      res.writeHead(200);
      res.end(JSON.stringify(tasks));
    } 
    
    // --- ROUTE: POST /tasks ---
    else if (url === '/tasks' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      
      req.on('end', async () => {
        try {
          const { title } = JSON.parse(body);
          if (!title) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Title is required' }));
          }

          const tasks = await getTasks();
          const newTask: Task = { id: Date.now(), title, status: 'pending' };
          tasks.push(newTask);
          
          await saveTasks(tasks);
          taskEmitter.emit('taskCreated', newTask); // Trigger Event

          res.writeHead(201);
          res.end(JSON.stringify(newTask));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    }

    // --- ROUTE: 404 NOT FOUND ---
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Route not found' }));
    }

  } catch (error) {
    // 7. Global Error Handling
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

// Start Server
const PORT = 3000;
await initDb();
server.listen(PORT, () => {
  console.log(`🚀 SmartTask TS-Native Server running at http://localhost:${PORT}`);
});
