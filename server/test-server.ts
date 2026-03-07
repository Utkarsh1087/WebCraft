import express from 'express';
const app = express();
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
});
