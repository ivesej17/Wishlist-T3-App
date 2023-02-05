import { env } from 'process';

// const bucketUrl = env.S3_BUCKET_URL || '';

const bucketUrl = 'https://wishlist-1dwx78.s3.us-west-2.amazonaws.com';

const fetchImages = async (downloadURLs: string[]) => {
    const images: File[] = [];

    let i = 0;

    for (const url of downloadURLs) {
        const image = await fetch(url, {
            method: 'GET',
            headers: {
                contentType: 'image/png',
            },
        }).then(async (response) => blobToFile(await response.blob(), `image${i++}.png`));

        images.push(image);
    }

    return images;
};

const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
    });
};

export default fetchImages;
