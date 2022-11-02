import { ButtonBuilder, ButtonStyle } from "discord.js";

export function getButton(id: string, label: string, emoji?: string) {
    return new ButtonBuilder({
        custom_id: id,
        label: label,
        emoji: emoji ?? ""
    });
}

export function getButtonPrimary(id: string, label: string, emoji?: string) {
    return getButton(id, label, emoji)
        .setStyle(ButtonStyle.Primary);
}
export function getButtonSecondary(id: string, label: string, emoji?: string) {
    return getButton(id, label, emoji)
        .setStyle(ButtonStyle.Secondary);
}
export function getButtonSuccess(id: string, label: string, emoji?: string) {
    return getButton(id, label, emoji)
        .setStyle(ButtonStyle.Success);
}
export function getButtonDanger(id: string, label: string, emoji?: string) {
    return getButton(id, label, emoji)
        .setStyle(ButtonStyle.Danger);
}

export function getButtonOK() {
    return getButtonSuccess("ok", "OK", "🆗");
}
