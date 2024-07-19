// method to resize images
// import sharp from 'sharp';
// export const resizeImage = (buffer: Buffer, width: number) => sharp(buffer).resize(width).withMetadata().toBuffer();

export const generateCode = (length: number, justMayus = false) => {
  const characters = justMayus
    ? 'ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789'
    : 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const stringToJson = (object) => {
  try {
    const json = JSON.parse(object);
    return json;
  } catch (e) {
    return object;
  }
};

export const secondsToHours = (seconds: number) => seconds / 3600;

export default {
  generateCode,
  stringToJson,
  secondsToHours,
};
