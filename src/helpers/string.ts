export function getPlural(num: number, ...forms: string[]) {
    let str: string;
    switch (forms.length) {
        case 1:
            throw new Error("Not enough forms");
        case 2:
            str = num > 1 ? forms[1] : forms[0];
            break;

        default:
            str = forms[getNounPluralForm(num)];
            break;
    }
    return str.replace(/%d/g, num.toString());
}

function getNounPluralForm(a: number) {
    if (a % 10 === 1 && a % 100 !== 11) {
        return 0;
    } else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) {
        return 1;
    } else {
        return 2;
    }
}

/**
 * Escape markdown chars
 */
export function fixMD(str: string): string {
    return str.replace(/_/g, "\\_").replace(/\*/g, "\\*");
}

/**
 * 
 * @returns {string} **Label:** Text
 */
export function labelString(label: string, text: string): string {
    return `**${label}:** ` + text;
}

/**
 * Removes indent after newlines
 */
export function remIndent(text: string): string {
    return text.replace(/\n\s+/gm, "\n");
}

/**
 * Format bytes to string
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 */
export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function matchEmoji(text: string) {
    const emoji = text.match(/a?:.+?:\d{18}|\p{Extended_Pictographic}/gu);
    if (emoji) {
        return emoji[0];
    }
    return null;
}

export function fixName(name: string) {
    return name.replace(/[\u{0080}-\u{03FF}\u{0500}-\u{FFFF}]/gmu, "?");
}
