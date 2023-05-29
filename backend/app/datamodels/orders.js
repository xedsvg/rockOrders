const mongoose = require('mongoose');
const { Orders } = require('../db/models');

const getActiveOrders = async (restaurantId) => {
    const orders = await Orders.find({
        restaurantId,
        status: { $in: ["recieved", "inProgress"] }
    })
        .populate('items')
        .populate({
            path: 'tabId',
            populate: {
                path: 'tableId'
            }
        }).exec();
    return orders;
};

const updateOrder = async (orderId, status) => {
    if (!["received", "inProgress", "done", 'canceled'].some((msg) => msg === status)) {
        throw new Error('Invalid status');
    } else {
        try {
            const order = await Orders.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            } else {
                order.status = status;
                await order.save();
                return order;
            }
        } catch (e) {
            throw new Error('Error updating order');
        }
    }
};

module.exports = {
    getActiveOrders,
    updateOrder,
};