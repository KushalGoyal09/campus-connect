export const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return secret;
};

export const getAwsSecret = (): string => {
    const secret = process.env.AWS_SECRET;
    if (!secret) {
        throw new Error("AWS_SECRET is not defined");
    }
    return secret;
};

export const getAwsKey = (): string => {
    const key = process.env.AWS_KEY;
    if (!key) {
        throw new Error("AWS_KEY is not defined");
    }
    return key;
};

export const getAwsRegion = (): string => {
    const region = process.env.AWS_REGION;
    if (!region) {
        throw new Error("AWS_REGION is not defined");
    }
    return region;
};

export const getS3Bucket = (): string => {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
        throw new Error("S3_BUCKET is not defined");
    }
    return bucket;
};

export const getEmailId = (): string => {
    const email = process.env.EMAIL_ID;
    if (!email) {
        throw new Error("EMAIL_ID is not defined");
    }
    return email;
};

export const getEmailPassword = (): string => {
    const password = process.env.EMAIL_PASSWORD;
    if (!password) {
        throw new Error("EMAIL_PASSWORD is not defined");
    }
    return password;
};
