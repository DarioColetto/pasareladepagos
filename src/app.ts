
import express from 'express';

const app = express();





const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, ()=> console.log(`API on http://localhost:${port}`));

export default app;
