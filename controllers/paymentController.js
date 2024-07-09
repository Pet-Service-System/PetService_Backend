const config = require('../config/payment');
const crypto = require('crypto');
const querystring = require('qs');

const vnp_TmnCode = config.vnp_TmnCode;
const vnp_HashSecret = config.vnp_HashSecret;
const vnp_Url = config.vnp_Url;
const vnp_ReturnUrl = config.vnp_ReturnUrl;

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

exports.createPayment = (req, res) => {
  const { amount, orderInfo, orderType, bankCode } = req.body;
  const ipAddr = req.ip;
  const createDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  const vnp_Params = {
    'vnp_Version': '2.1.0',
    'vnp_Command': 'pay',
    'vnp_TmnCode': vnp_TmnCode,
    'vnp_Locale': 'vn',
    'vnp_CurrCode': 'VND',
    'vnp_TxnRef': Date.now(),
    'vnp_OrderInfo': orderInfo,
    'vnp_OrderType': orderType,
    'vnp_Amount': amount * 100,
    'vnp_ReturnUrl': vnp_ReturnUrl,
    'vnp_IpAddr': ipAddr,
    'vnp_CreateDate': createDate,
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  const sortedParams = sortObject(vnp_Params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  sortedParams['vnp_SecureHash'] = signed;
  const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams, { encode: false })}`;

  res.json({ paymentUrl });
};

exports.returnPayment = (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = sortObject(vnp_Params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    // Kiểm tra thông tin giao dịch trong database và xử lý kết quả
    res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
  } else {
    res.render('success', { code: '97' });
  }
};
