import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// JPEG has no alpha channel, so saving a transparent PNG as JPEG flattens
// every transparent pixel onto a solid (typically black) background. Keep
// PNG images as PNG so transparency survives the crop/resize round-trip.
export const getImageSaveFormat = (asset: { mimeType?: string | null; fileName?: string | null }) =>
    asset.mimeType === "image/png" || /\.png$/i.test(asset.fileName ?? "")
        ? SaveFormat.PNG
        : SaveFormat.JPEG;

// Center-crops the source image to the target aspect ratio, then resizes it
// to the exact target dimensions. Done programmatically (rather than via the
// native picker's built-in crop UI) because expo-image-picker's `allowsEditing`
// crop is always a 1:1 square on iOS, so it can't produce a 4:3 detail image.
export const cropAndResize = async (
    uri: string,
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number,
    format: SaveFormat = SaveFormat.JPEG,
): Promise<string> => {
    const targetAspect = targetWidth / targetHeight;
    const sourceAspect = sourceWidth / sourceHeight;

    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;
    if (sourceAspect > targetAspect) {
        cropWidth = Math.round(sourceHeight * targetAspect);
    } else {
        cropHeight = Math.round(sourceWidth / targetAspect);
    }
    const originX = Math.round((sourceWidth - cropWidth) / 2);
    const originY = Math.round((sourceHeight - cropHeight) / 2);

    const context = ImageManipulator.manipulate(uri);
    context.crop({ originX, originY, width: cropWidth, height: cropHeight });
    context.resize({ width: targetWidth, height: targetHeight });

    const rendered = await context.renderAsync();
    // compress only applies to lossy formats; PNG is always lossless
    const result = await rendered.saveAsync(
        format === SaveFormat.PNG ? { format } : { format, compress: 0.9 },
    );
    return result.uri;
};
