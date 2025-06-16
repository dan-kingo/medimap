import express, {Request, Response} from 'express';
import morgan from "morgan"
import debug from 'debug';
import cors from 'cors'

import connectDB from './configs/db.js';
import accessLogStream from './middlewares/loggerMiddleware.js';
import corsOptions from './middlewares/corsOptionsMiddleware.js';

const appDebug = debug('app:startup');
const app = express();
const PORT = process.env.PORT || 3000;

connectDB()

app.use(express.json())
app.use(morgan("combined",{stream:accessLogStream}))
app.use(cors(corsOptions))

app.get('/', (_req:Request, res:Response) => {
  res.send('Hello, World!');
}
);

app.listen(PORT, () => {
  appDebug(`Server is running on http://localhost:${PORT}`);
}
);
export default app;