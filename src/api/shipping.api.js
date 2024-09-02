import request from "./request";

export const fetchShippingList = (data) => {
    return request.get('/users/shippings');
};