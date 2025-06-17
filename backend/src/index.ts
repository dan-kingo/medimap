import express, {} from 'express';
import morgan from "morgan"
import debug from 'debug';
import cors from 'cors'

import connectDB from './configs/db.js';
import accessLogStream from './middlewares/loggerMiddleware.js';
import corsOptions from './middlewares/corsOptionsMiddleware.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import medicineRoutes from './routes/medicine.routes.js';
import homeRoutes from './routes/home.routes.js';

const appDebug = debug('app:startup');
const app = express();
const PORT = process.env.PORT || 3000;

connectDB()

app.use(express.json())
app.use(morgan("combined",{stream:accessLogStream}))
app.use(cors(corsOptions))
app.use("/api",authRoutes)
app.use('/api/profile', profileRoutes);
app.use('/api/pharmacies/nearby', homeRoutes);
app.use('/api/medicines', medicineRoutes);


app.listen(PORT, () => {
  appDebug(`Server is running on http://localhost:${PORT}`);
}
);
export default app;