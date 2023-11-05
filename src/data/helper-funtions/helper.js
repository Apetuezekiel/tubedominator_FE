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

export const formatNumberToKMBPlus = (number) => {
  if (number >= 1000000000) {
    const formattedNumber = Math.floor(number / 1000000000);
    return formattedNumber + "B+";
  } else if (number >= 1000000) {
    const formattedNumber = Math.floor(number / 1000000);
    return formattedNumber + "M+";
  } else if (number >= 1000) {
    const formattedNumber = Math.floor(number / 1000);
    return formattedNumber + "K+";
  } else {
    return number.toString() + "+";
  }
};
