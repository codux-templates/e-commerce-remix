const WIX_IMAGE_URL_PREFIX = 'wix:image://v1/';
const WIX_MEDIA_API_URL = 'https://static.wixstatic.com/media/';
const DEFAULT_IMAGE_QUALITY = 90;

export interface ImageUrlOptions {
    fitWidth: number;
    fitHeight: number;
    quality?: number;
}

export function getImageUrl(imageUrl: string, options?: ImageUrlOptions) {
    if (imageUrl.startsWith(WIX_IMAGE_URL_PREFIX)) {
        const resultUrl = new URL(imageUrl.replace(WIX_IMAGE_URL_PREFIX, ''), WIX_MEDIA_API_URL);

        if (options) {
            const optionsQuery = `w_${options.fitWidth},h_${options.fitHeight},q_${
                options.quality ?? DEFAULT_IMAGE_QUALITY
            }`;

            resultUrl.hash = '';
            const imageWithOptionsUrl = new URL(`v1/fit/${optionsQuery}/file.jpg`, `${resultUrl}/`);
            return imageWithOptionsUrl.toString();
        }

        return resultUrl.toString();
    }

    return imageUrl;
}
