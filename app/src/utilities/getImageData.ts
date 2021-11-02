import { fallback } from './fallback';

export async function getImageData(primaryUrl: string, ...fallbackUrls: string[]): Promise<ImageData> {
  return fallback(
    async (url: string): Promise<ImageData> => {
      const result = await fetch(url, { headers: { Accept: 'image/png, image/gif, image/jpeg' } });

      if (!result.ok) {
        throw Error(`Failed to load image "${primaryUrl}" or fallbacks (status: ${result.status})`);
      }

      const data = await result.blob();
      const src = URL.createObjectURL(data);
      const img = await getImage(src);

      URL.revokeObjectURL(src);

      const canvas = document.createElement('canvas');

      canvas.height = img.height;
      canvas.width = img.width;

      const ctx = canvas.getContext('2d');

      if (ctx == null) {
        throw Error('Failed to get canvas 2d context');
      }

      ctx.drawImage(img, 0, 0);

      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    },
    [primaryUrl, ...fallbackUrls],
  );
}

function getImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err.error));
    img.src = src;
  });
}
