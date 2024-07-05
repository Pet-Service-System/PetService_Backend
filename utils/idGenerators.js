const mongoose = require('mongoose');
const Account = require('../models/Account');
const Order = require('../models/Order');
const Pet = require('../models/Pet');
const Product = require('../models/Product');
const SpaService = require('../models/SpaService');
const OrderDetails = require('../models/OrderDetails');
const SpaBookingDetails = require('../models/SpaBookingDetails');
const SpaBooking = require('../models/SpaBooking');
const Comment = require('../models/Comment');

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
      const commentNumber = parseInt(lastCommentID.replace('C', ''), 10) + 1;
      return `C${commentNumber.toString().padStart(3, '0')}`;
    } else {
      return 'C001';
    }
  },

  generateOrderID: async () => {
    const lastOrder = await Order.findOne().sort({ OrderID: -1 });
    if (lastOrder) {
      const lastOrderID = lastOrder.OrderID;
      const orderNumber = parseInt(lastOrderID.replace('O', ''), 10) + 1;
      return `O${orderNumber.toString().padStart(3, '0')}`;
    } else {
      return 'O001';
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

  generateHotelID: async () => {
    const lastHotel = await HotelService.findOne().sort({ HotelID: -1 });

    if (lastHotel && lastHotel.HotelID) {
      const lastHotelId = parseInt(lastHotel.HotelID.slice(2));
      const newHotelId = `HT${("000" + (lastHotelId + 1)).slice(-4)}`;
      return newHotelId;
    } else {
      return 'HT0001';
    }
  },

  generateSpaBookingID: async () => {
    let isUnique = false;
    let newId;

    while (!isUnique) {
      // Generate a new BookingID
      const lastBooking = await SpaBooking.findOne().sort({ BookingID: -1 });

      if (lastBooking && lastBooking.BookingID) {
        const lastId = parseInt(lastBooking.BookingID.slice(2));
        newId = `SB${("000" + (lastId + 1)).slice(-3)}`;
      } else {
        newId = 'SB001'; // Starting ID if there are no bookings
      }

      // Check if the generated BookingID already exists
      const existingBooking = await SpaBooking.findOne({ BookingID: newId });
      if (!existingBooking) {
        isUnique = true;
      }
    }

    return newId;
  },

  generateOrderDetailsID: async () => {
    const lastOrderDetails = await OrderDetails.findOne().sort({ OrderDetailsID: -1 });

    if (lastOrderDetails && lastOrderDetails.OrderDetailsID) {
      const lastOrderDetailsID = parseInt(lastOrderDetails.OrderDetailsID.slice(2));
      const newOrderDetailsID = `OD${("000" + (lastOrderDetailsID + 1)).slice(-3)}`;
      return newOrderDetailsID;
    } else {
      return 'OD001';
    }
  },

  generateSpaBookingDetailsID: async () => {
    let isUnique = false;
    let newId;

    while (!isUnique) {
      // Generate a new BookingDetailsID
      const lastBookingDetails = await SpaBookingDetails.findOne().sort({ BookingDetailsID: -1 });

      if (lastBookingDetails && lastBookingDetails.BookingDetailsID) {
        const lastId = parseInt(lastBookingDetails.BookingDetailsID.slice(3));
        newId = `SBD${("000" + (lastId + 1)).slice(-3)}`;
      } else {
        newId = 'SBD001'; // Starting ID if there are no booking details
      }

      // Check if the generated BookingDetailsID already exists
      const existingBookingDetails = await SpaBookingDetails.findOne({ BookingDetailsID: newId });
      if (!existingBookingDetails) {
        isUnique = true;
      }
    }
    
    return newId;

  },

   getStartOfWeek: () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay() + 1; 
    const startOfWeek = new Date(now.setDate(firstDay));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  },
  
   getEndOfWeek: () => {
    const now = new Date();
    const lastDay = now.getDate() - now.getDay() + 7; 
    const endOfWeek = new Date(now.setDate(lastDay));
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  },

};
module.exports = idGenerators;
