export const fileListToBlobArray = (files: FileList | null) => {
    if(!files || files.length === 0) return [];
    
    const blobArray: Blob[] = [];
    
    for(const file of files) {
        blobArray.push(file as Blob);
    }

    return blobArray;
};