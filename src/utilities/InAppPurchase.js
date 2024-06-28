import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';


export const getProductDetail = async (purchaseId) => {
    try {
      const connection = true;
     if(connection){
  const products = await RNIap.getProducts(purchaseId);
  let prices = [];
  let pricesLine = [];
  // console.log(products, 'productss from store:::::');
  for (let j in products) {
    // console.log(j, 'j value:::::::');
    pricesLine.push(
      products[j].localizedPrice || products[j].originalPriceAndroid  
    );
  }
  prices.push(pricesLine);
  return prices;
}
else {
  // alert(JSON.stringify(connection));
}
      } catch(err) {
        console.warn(err,"err===>");
      }
}

export const getVipProductDetail = async (purchaseId) => {
  try {
    const connection = await RNIap.initConnection();
    if (connection) {
      try {
        const products = await RNIap.getSubscriptions(purchaseId);
        let prices = [];
        let pricesLine = [];
        for (let j in products) {
          // console.log(j, 'j value:::::::');
          pricesLine.push(
            products[j].localizedPrice || products[j].originalPriceAndroid  
          );
        }
        prices.push(pricesLine);
        return prices;
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}