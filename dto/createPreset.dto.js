module.exports.createPresetDto = (name, download_link, author_id, size, thumbnail, preview_1, preview_2) => {
    return {
        name: name,
        download_link: download_link,
        author_id: author_id,
        size: size,
        thumbnail: thumbnail,
        preview_1: preview_1,
        preview_2: preview_2
    }
}