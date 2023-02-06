export type UploadInput = {
    url: string;
    file: File;
}

export const uploadImageToS3 = (uploadInput: UploadInput) => {
    return fetch(uploadInput.url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'image/png',
        },
        body: uploadInput.file,
    });
}