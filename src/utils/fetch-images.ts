import { env } from 'process';

// const bucketUrl = env.S3_BUCKET_URL || '';

const bucketUrl = 'https://wishlist-1dwx78.s3.us-west-2.amazonaws.com';

const fetchImages = async (imageKeys: string[]) => {
    const images: Blob[] = [];

    for (const imageKey of imageKeys) {
        const url = `${bucketUrl}/${imageKey}`;

        console.log(url);

        const image = await fetch(url, {
            method: 'GET',
            headers: {
                contentType: 'image/png',
            },
        }).then((response) => response.blob());

        images.push(image);
    }

    return images;
};

export default fetchImages;
