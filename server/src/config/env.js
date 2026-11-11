import 'dotenv/config';

const required = (k) => {
    const v = process.env[k];
    if (!v && process.env.NODE_ENV === 'production') throw new Error(`Missing env: ${k}`);
    return v;
};

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5002),
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: required('JWT_SECRET') || 'dev-secret',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    uploadDriver: process.env.UPLOAD_DRIVER || 'local',
    mediaBaseUrl: process.env.MEDIA_BASE_URL || '/media',
    verificationRetentionDays: Number(process.env.VERIFICATION_RETENTION_DAYS || 30),
};