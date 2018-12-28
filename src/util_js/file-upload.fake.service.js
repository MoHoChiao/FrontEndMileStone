function upload(formData) {
    const drivers = formData.getAll('files');
    const promises = drivers.map((x) => getFiles(x)
        .then(fileObj => ({
            originalName: x.name,
            fileName: x.name,
            size: x.size
        })));
    return Promise.all(promises);
}

function getFiles(file) {
    return new Promise((resolve, reject) => {
        const fReader = new FileReader();

        fReader.onload = () => {
            resolve();
        }

        fReader.readAsDataURL(file);
    })
}

export { upload }