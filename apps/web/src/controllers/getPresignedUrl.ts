import { getAwsKey, getAwsRegion, getAwsSecret } from "@kushal/utils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getpresignedUrl = async (fileName: string, fileType: string) => {
    const client = new S3Client({
        region: getAwsRegion(),
        credentials: {
            accessKeyId: getAwsKey(),
            secretAccessKey: getAwsSecret(),
        },
    });

    const command = new PutObjectCommand({
        Bucket: "campus-connect.bucket",
        Key: `uploads/${fileName}-${Date.now()}`,
        ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(client, command);
    const url = new URL(presignedUrl);
    const imageUrl = url.origin + url.pathname;
    return {
        presignedUrl,
        imageUrl,
    };
};

export default getpresignedUrl;
