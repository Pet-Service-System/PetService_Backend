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
