// pages/api/listings.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";

interface IListingsParams extends Prisma.ListingFindManyArgs {
    page?: number;
    pageSize?: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Inside pages/api/listings.ts");

    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    try {
        const { page = 1, pageSize = 10, ...restParams } = req.query as IListingsParams;
        const skip = (page - 1) * pageSize;

        const listings = await prisma.listing.findMany({
            ...restParams,
            skip,
            take: pageSize,
            include: { images: true },
        });

        // @ts-ignore
        const totalCount = await prisma.listing.count(restParams);

        res.status(200).json({ listings, totalPages: Math.ceil(totalCount / pageSize) });
    } catch (error: any) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ message: "An error occurred while fetching listings" });
    }
};
