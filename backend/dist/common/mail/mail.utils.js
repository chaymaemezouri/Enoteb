"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSmtpConfigured = isSmtpConfigured;
exports.escapeHtml = escapeHtml;
exports.formatFrenchDateTime = formatFrenchDateTime;
const PLACEHOLDER_SMTP_HOSTS = new Set(['smtp.example.com', 'example.com', 'localhost']);
function isSmtpConfigured(smtp) {
    const host = smtp?.host?.trim().toLowerCase() ?? '';
    const user = smtp?.user?.trim() ?? '';
    const pass = smtp?.pass?.trim() ?? '';
    const port = smtp?.port;
    if (!host || !user || !pass || !port || Number.isNaN(port)) {
        return false;
    }
    if (PLACEHOLDER_SMTP_HOSTS.has(host)) {
        return false;
    }
    if (pass === 'change-me' || user.includes('example.com')) {
        return false;
    }
    return true;
}
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function formatFrenchDateTime(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Africa/Casablanca',
    }).format(date);
}
//# sourceMappingURL=mail.utils.js.map