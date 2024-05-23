import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 6969; // or any other port you prefer

app.use(cors())
// Define a route for fetching data
app.get('/data/:id', async (req: Request, res: Response) => {
    try {
        // Extract ID from request parameters
        const id = req.params.id;
        // Make a GET request using Axios
        const response = await axios.get(`https://api.malsync.moe/mal/anime/${id}`);
        // Send the data back to the client
        res.json(response.data);
    } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
