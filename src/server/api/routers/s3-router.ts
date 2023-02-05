import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import * as AWS from 'aws-sdk';
import { z } from 'zod';
import { env } from 'process';
import { randomBytes } from 'crypto';

const s3 = new AWS.S3();

const bucketName = env.S3_BUCKET_NAME || '';

s3.config.update({
    region: env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: env.S3_BUCKET_ACCESSKEY || '',
        secretAccessKey: env.S3_BUCKET_SECRETACCESSKEY || '',
    },
});

const bucketUrl = env.S3_BUCKET_URL || '';

// Create router with procedure definitions.
export const s3_Router = createTRPCRouter({
    getUploadURL: protectedProcedure.mutation(async () => {
        type AmazonUploadDetails = {
            key: string;
            url: string;
        };

        const key = randomBytes(16).toString('hex') + '.png';

        const requestParams: unknown = {
            Bucket: bucketName,
            Key: key,
            Expires: 30,
            ContentType: 'image/png',
        };

        const amazonUploadDetails: AmazonUploadDetails = {
            key: key,
            url: await s3.getSignedUrlPromise('putObject', requestParams),
        };

        return amazonUploadDetails;
    }),

    getDownloadURLs: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
        const photoRecords = await ctx.prisma.wishlistItemPhoto.findMany({
            where: { wishlistItemID: input },
        });

        if (photoRecords.length === 0) return [];

        const downloadURLs: string[] = [];

        for(const record of photoRecords) {
            const requestParams: unknown = {
                Bucket: bucketName,
                Key: record.imageKey,
                Expires: 30,
            };

            const downloadURL = await s3.getSignedUrlPromise('getObject', requestParams);
            downloadURLs.push(downloadURL);
        }

        return downloadURLs;
    }),
});
