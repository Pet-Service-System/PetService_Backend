const Voucher = require("../models/Voucher");
const { generateVoucherID, generateVoucherPattern } = require('../utils/idGenerators');

// Create a new voucher
exports.createVoucher = async (req, res) => {
  try {
    const pattern = req.body.Pattern;
    if (pattern) {
      const voucherID = await generateVoucherID();
      const voucher = new Voucher({...req.body, VoucherID: voucherID, Pattern: pattern});
      await voucher.save();
      res.status(201).send(voucher);
    }
    else{
    const voucherID = await generateVoucherID();
    const voucherPattern = await generateVoucherPattern();
    const voucher = new Voucher({...req.body, VoucherID: voucherID, Pattern: voucherPattern});
    await voucher.save();
    res.status(201).send(voucher);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).send(vouchers);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a voucher by ID
exports.getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({VoucherID:req.params.id});
    if (!voucher) {
      return res.status(404).send({ message: 'Voucher not found' });
    }
    res.status(200).send(voucher);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a voucher by ID
exports.updateVoucher = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.VoucherID;
    delete updateData.voucherPattern;
  try {
    const pattern = await generateVoucherPattern();
    updateData.Pattern = pattern;
    const voucher = await Voucher.findOneAndUpdate({ VoucherID: id }, updateData, { new: true });
    if (!voucher) {
      return res.status(404).send({ message: 'Voucher not found' });
    }
    res.status(200).send(voucher);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a voucher by ID
exports.deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOneAndDelete({VoucherID: req.params.id});
    if (!voucher) {
      return res.status(404).send({ message: 'Voucher not found' });
    }
    res.status(200).send({ message: 'Voucher deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.isVoucherValid = async (req, res) => {
  const { pattern, orderValue } = req.body;

  try {
    const voucher = await Voucher.findOne({ Pattern: pattern });

    if (!voucher) {
      return res.status(404).send({ isValid: false, message: 'Voucher does not exist.' });
    }

    if (voucher.Status !== 'Active') {
      return res.status(400).send({ isValid: false, message: 'Voucher is not active.' });
    }

    if (new Date() > voucher.ExpirationDate) {
      return res.status(400).send({ isValid: false, message: 'Voucher has expired.' });
    }

    if (voucher.MinimumOrderValue && orderValue < voucher.MinimumOrderValue) {
      return res.status(400).send({ isValid: false, message: `Order value must be at least ${voucher.MinimumOrderValue}.` });
    }

    return res.status(200).send({ isValid: true, voucher});

  } catch (error) {
    res.status(500).send({ isValid: false, message: 'Internal server error.', error });
  }
};

// Get a voucher by pattern
exports.getVoucherByPattern = async (req, res) => {
  try {
    const pattern = req.params.pattern
    const voucher = await Voucher.findOne({Pattern: pattern});
    if (!voucher || voucher.Status !== 'Active')  {
      return res.status(404).send({ message: 'Voucher not found or inactive' });
    }
    if (new Date(voucher.ExpirationDate) < new Date()) {
      return res.status(400).send({ message: 'Voucher expired' });
    }
    res.status(200).send(voucher);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a voucher by pattern
exports.updateUsageLimit = async (req, res) => {
  const { pattern } = req.params; 

  try {
    const voucher = await Voucher.findOneAndUpdate(
      { Pattern: pattern },
      { $inc: { UsageLimit: - 1 } },
      { new: true }
    );

    if (!voucher) {
      return res.status(404).send({ message: 'Voucher not found' });
    }

    res.status(200).send(voucher);
  } catch (error) {
    res.status(400).send(error);
  }
};