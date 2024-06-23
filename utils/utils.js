const mongoose = require('mongoose');
const Account = require('./models/Account'); // Replace with your Account model
const HotelBooking = require('./models/HotelBooking'); // Replace with your HotelBooking model
const Order = require('./models/Order'); // Replace with your Order model
const Pet = require('./models/Pet'); // Replace with your Pet model
const Product = require('./models/Product'); // Replace with your Product model
const SpaService = require('./models/SpaService'); // Replace with your SpaService model

const idGenerators = {
  generateAccountID: async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const lastAccount = await Account.findOne({}, { AccountID: 1 }).sort({ AccountID: -1 }).session(session).exec();
      let lastId = 0;

      if (lastAccount && lastAccount.AccountID) {
        const idPart = lastAccount.AccountID.substring(1);
        if (/^\d+$/.test(idPart)) {
          lastId = parseInt(idPart);
        } else {
          console.error(`Invalid AccountID format found: ${lastAccount.AccountID}`);
          throw new Error('Invalid last account ID format');
        }
      }

      const newId = `A${(lastId + 1).toString().padStart(3, '0')}`;
      await session.commitTransaction();
      session.endSession();
      return newId;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  generateCommentID: async () => {
    const lastComment = await Comment.findOne().sort({ CommentID: -1 }).exec();
    if (lastComment) {
      const lastCommentID = lastComment.CommentID;
      const commentNumber = parseInt(lastCommentID.replace('Comment', ''), 10) + 1;
      return `Comment${commentNumber.toString().padStart(3, '0')}`;
    } else {
      return 'C001';
    }
  },

  generateBookingDetailID: async () => {
    const lastBooking = await HotelBooking.findOne().sort({ BookingDetailID: -1 }).exec();
    if (lastBooking) {
      const lastIdNum = parseInt(lastBooking.BookingDetailID.substring(2), 10);
      const newIdNum = lastIdNum + 1;
      return `HB${newIdNum.toString().padStart(3, '0')}`;
    }
    return 'HB001';
  },

  generateOrderID: async () => {
    const lastOrder = await Order.findOne().sort({ OrderID: -1 });
    if (lastOrder) {
      const lastOrderID = lastOrder.OrderID;
      const orderNumber = parseInt(lastOrderID.replace('Order', ''), 10) + 1;
      return `Order${orderNumber.toString().padStart(3, '0')}`;
    } else {
      return 'Order001';
    }
  },

  generatePetID: async () => {
    let isUnique = false;
    let newPetId;

    while (!isUnique) {
      const lastPet = await Pet.findOne().sort({ PetID: -1 });

      if (lastPet && lastPet.PetID) {
        const lastPetId = parseInt(lastPet.PetID.slice(2));
        newPetId = `PT${("00000" + (lastPetId + 1)).slice(-5)}`;
      } else {
        newPetId = 'PT00001';
      }

      const existingPet = await Pet.findOne({ PetID: newPetId });
      if (!existingPet) {
        isUnique = true;
      }
    }

    return newPetId;
  },

  generateProductId: async () => {
    const lastProduct = await Product.findOne().sort({ ProductID: -1 });

    if (lastProduct && lastProduct.ProductID) {
      const lastProductId = parseInt(lastProduct.ProductID.slice(1));
      const newProductId = `P${("000" + (lastProductId + 1)).slice(-3)}`;
      return newProductId;
    } else {
      return 'P001';
    }
  },

  generateServiceID: async () => {
    const lastService = await SpaService.findOne().sort({ ServiceID: -1 });

    if (lastService && lastService.ServiceID) {
      const lastServiceId = parseInt(lastService.ServiceID.slice(1));
      const newServiceId = `S${("000" + (lastServiceId + 1)).slice(-3)}`;
      return newServiceId;
    } else {
      return 'S001';
    }
  },
};

module.exports = idGenerators;
