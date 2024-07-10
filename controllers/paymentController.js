// File: controllers/paymentController.js

require('dotenv').config();
const querystring = require('qs');
const crypto = require("crypto");

// Function to sort object by keys
const sortObject = (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
};

// Create Payment URL
exports.createPaymentUrl = async (req, res) => {
    const { default: dateFormat } = await import('dateformat');
    
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    const date = new Date();
    const createDate = dateFormat(date, 'yyyyMMddHHmmss');
    const expireDate = dateFormat(new Date(date.getTime() + 60 * 60 * 1000), 'yyyymmddHHmmss');
    const orderId = dateFormat(date, 'DDHHmmss');
    const amount = req.body.totalAmount * 100; // Convert to integer without decimal part
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription;
    const orderType = req.body.orderType;
    let locale = req.body.language || 'vn'; // Default to 'vn' if language not provided
    const currCode = 'VND';

    const vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': locale,
        'vnp_CurrCode': currCode,
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': decodeURIComponent('Thanh toan cho ma GD:' + orderId),
        'vnp_OrderType': 'other',
        'vnp_Amount': amount,
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': decodeURIComponent(ipAddr),
        'vnp_CreateDate': createDate,
        'vnp_ExpireDate': expireDate
    };
    console.log(vnp_Params);
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    sortedParams['vnp_SecureHash'] = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams)}`;

    res.json({ paymentUrl });
};

// Handle IPN URL
exports.handleIpnUrl = (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNP_HASHSECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        const rspCode = vnp_Params['vnp_ResponseCode'];
        // Update order status based on vnp_Params
        res.status(200).json({ RspCode: '00', Message: 'Success' });
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
};

// Handle Return URL
exports.handleReturnUrl = (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASHSECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        // Validate order in the database
        res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
        res.render('success', { code: '97' });
    }
};
