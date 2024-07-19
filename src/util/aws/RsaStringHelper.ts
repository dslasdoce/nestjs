class RsaStringHelper {
  static processKeyString = (keyString) => {
    const beginString = '-----BEGIN RSA PRIVATE KEY-----';
    const endString = '-----END RSA PRIVATE KEY-----';
    let processedKey = keyString.replace(beginString, '').replace(/"/g, '\n');
    processedKey = processedKey.replace(endString, '\n');
    processedKey = processedKey.replace(/\s+/g, '\n');
    processedKey = `${beginString}${processedKey}${endString}`;
    return processedKey;
  };
}

export default RsaStringHelper;
