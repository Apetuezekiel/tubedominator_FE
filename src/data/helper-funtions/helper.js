/* eslint-disable */

const decryptAndRetrieveData = (data) => {
  const secretKey = "+)()^77---<@#$>";

  if (data) {
    const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedData = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8),
    );
    return decryptedData;
  }
  return null;
};
