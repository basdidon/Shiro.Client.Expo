export function formatDateTime(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yy = pad(date.getFullYear() % 100);
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
}
