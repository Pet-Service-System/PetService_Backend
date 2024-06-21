const crypto = require('crypto');
const querystring = require('querystring');
const config = require('config');

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
};

const createPayment = async (req, res) => {
  const dateFormat = (await import('dateformat')).default; // Dynamic import
  const ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = process.env.VNP_TMNCODE || config.get('vnp_TmnCode');
  const secretKey = process.env.VNP_HASHSECRET || config.get('vnp_HashSecret');
  const vnpUrl = process.env.VNP_URL || config.get('vnp_Url');
  const returnUrl = process.env.VNP_RETURNURL || config.get('vnp_ReturnUrl');

  const date = new Date();
  const createDate = dateFormat(date, 'yyyymmddHHmmss');
  const orderId = dateFormat(date, 'HHmmss');
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;
  
  const orderInfo = req.body.orderDescription;
  const orderType = req.body.orderType;
  let locale = req.body.language;
  if(locale === null || locale === '') {
    locale = 'vn';
  }
  const currCode = 'VND';
  const vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if(bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  const sortedParams = sortObject(vnp_Params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex'); 
  sortedParams['vnp_SecureHash'] = signed;
  const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams, { encode: false })}`;

  res.status(200).json({ paymentUrl });
};

const verifyVNPayReturn = async (req, res) => {
  const dateFormat = (await import('dateformat')).default; // Dynamic import
  let vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET || config.get('vnp_HashSecret'));
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    if (vnp_Params['vnp_ResponseCode'] === '00') {
      res.json({ message: 'Payment successful', data: vnp_Params });
    } else {
      res.json({ message: 'Payment failed', data: vnp_Params });
    }
  } else {
    res.status(400).json({ message: 'Invalid signature' });
  }
};

module.exports = {
  createPayment,
  verifyVNPayReturn,
};
