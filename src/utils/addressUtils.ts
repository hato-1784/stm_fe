// 郵便番号から住所を取得する関数
export const fetchAddressFromPostalCode = async (postalCode: string): Promise<string> => {
  if (postalCode.length === 7) { // 日本の郵便番号は7桁
    try {
      const response = await fetch(`https://api.zipaddress.net/?zipcode=${postalCode}`);
      const data = await response.json();
      return data.data.fullAddress || '';
    } catch (error) {
      console.error('住所の自動入力に失敗しました。', error);
      return '';
    }
  }
  return '';
};