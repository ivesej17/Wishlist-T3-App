import { createTRPCRouter, publicProcedure } from '../trpc';
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

// Create router with procedure definitions.
export const s3_Router = createTRPCRouter({
    getUploadURL: publicProcedure.mutation(async () => {
        const key = randomBytes(16).toString('hex') + '.png';

        const requestParams: unknown = {
            Bucket: bucketName,
            Key: key,
            Expires: 30,
            ContentType: 'image/png',
        };

        return await s3.getSignedUrlPromise('putObject', requestParams);
    }),
});
