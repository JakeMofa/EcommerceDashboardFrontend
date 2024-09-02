import request from './request';

export const fetchPoTemplateList = (_data) => {
    return request.get(`/po-template`);
};

export const postPoTemplate = (data) => {
    return request.post(`/po-template`, data);
};
