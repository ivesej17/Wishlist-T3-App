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
