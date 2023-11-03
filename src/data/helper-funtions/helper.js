/* eslint-disable */

const decryptAndRetrieveData = (data) => {
  const secretKey = process.env.REACT_APP_JWT_SECRET;

  if (data) {
    const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedData = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8),
    );
    return decryptedData;
  }
  return null;
};
