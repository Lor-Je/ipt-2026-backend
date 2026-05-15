import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';
import db from './_helpers/db';

const app = express();

// Trust Vercel's proxy so req.ip and secure cookies work
app.set('trust proxy', 1);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? (corsOrigin ? corsOrigin.split(',').map((x: string) => x.trim()) : false)
        : (origin: any, callback: any) => callback(null, true),
    credentials: true
}));

// Wait for DB initialization before handling requests (important on Vercel cold starts)
app.use(async (_req, res, next) => {
    try {
        if (db.ready) await db.ready;
        next();
    } catch (err) {
        console.error('DB not ready:', err);
        res.status(500).json({ message: 'Database not ready' });
    }
});

// Health check / root route (prevents 500 on '/')
app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Node MySQL API is running',
        docs: '/api-docs'
    });
});

// API routes
app.use('/accounts', accountsController);

// Swagger docs route
app.use('/api-docs', swaggerDocs);

// Global error handler
app.use(errorHandler);

// Start server only when NOT running on Vercel (Vercel uses the exported app as a serverless handler)
if (!process.env.VERCEL) {
    const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
    app.listen(port, () => console.log('Server listening on port ' + port));
}

export default app;
