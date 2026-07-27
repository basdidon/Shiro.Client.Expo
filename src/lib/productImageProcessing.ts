import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

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
    const result = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.9 });
    return result.uri;
};
