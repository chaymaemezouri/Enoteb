export interface SmtpConfig {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
}
export declare function isSmtpConfigured(smtp: SmtpConfig | undefined): boolean;
export declare function escapeHtml(value: string): string;
export declare function formatFrenchDateTime(date: Date): string;
