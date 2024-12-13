import { Quest } from "./types"
import axios from 'axios'
import express, { Express } from 'express';
import bodyParser from 'body-parser';


export async function Handler() {
    try {
        const url: string = "https://polyquest.xyz/api/actions/quests/275"
        const response = await axios.get(url);
        const data : Quest = response.data.quest

        return data;    

    } catch (error) {
        console.error(`Error`);
    }
}

export async function createServer(): Promise<Express> {
    const app: Express = express();
    const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

    app.use(bodyParser.json());

    app.post('/external-data', async (req, res) => {
        try {
            const requestData = req;
            console.log('Received data:', requestData);

            res.status(200).send('Data received successfully');
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    return app;
}