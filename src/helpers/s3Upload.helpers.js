import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  httpOptions: {
    timeout: 10000000,
  },
});

export const uploadFile = (file, key, setProgress) => {
  const params = {
    Body: file,
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
    Key: key,
  };

  myBucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      setProgress(Math.round((evt.loaded / evt.total) * 95));
    })
    .send((err) => {
      if (err) {
        setProgress(0);
        console.log(err);
      } else {
        setProgress(100);
      }
    });
};

export const fileDownloadUrl = (key) => {
  return myBucket.getSignedUrl("getObject", {
    Key: key,
    Expires: 300000,
  });
};
