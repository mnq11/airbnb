import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(400).json({ error: 'Error message' });
};

export default handler;
