declare const _default: () => {
    nodeEnv: string | undefined;
    port: number;
    databaseUrl: string | undefined;
    jwt: {
        secret: string | undefined;
        refreshSecret: string | undefined;
        expiresIn: string | undefined;
        refreshExpiresIn: string | undefined;
    };
    smtp: {
        host: string | undefined;
        port: number;
        user: string | undefined;
        pass: string | undefined;
    };
    contactEmail: string | undefined;
    corsOrigin: string | undefined;
    upload: {
        dir: string | undefined;
        maxFileSize: number;
        imageMaxWidth: number;
        imageMaxHeight: number;
        thumbnailWidth: number;
        imageQuality: number;
    };
};
export default _default;
