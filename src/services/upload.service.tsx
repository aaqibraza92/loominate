import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "AKIA3COGKEPYSWKZNZVA",
  secretAccessKey: "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",
});

const s3Url = "https://loominate.s3.ap-southeast-1.amazonaws.com/";
const uploadFile = async (file : any) => {
  try {
    let key = file.uid + file.name;
    const destparams = {
      Bucket: "loominate",
      Key: key,
      Body: file,
      ContentType: file.type,
    };
    const putResult = await s3.putObject(destparams).promise();

    console.log({ putResult });
    let finalUrl = s3Url + key;
    return finalUrl;
  } catch (error) {
    console.log(error);
    return;
  }
};

const uploadService = {
  uploadFile,
};

export default uploadService;
