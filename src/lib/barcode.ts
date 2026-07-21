// groups digits into 6s counting from the right (e.g. "8850123456789" -> "8 850123 456789"),
// using a non-breaking space so the whole barcode can't get wrapped onto separate lines
export const formatBarcode = (barcode: string): string =>
    /^\d+$/.test(barcode) ? barcode.replace(/\B(?=(\d{6})+(?!\d))/g, " ") : barcode;
