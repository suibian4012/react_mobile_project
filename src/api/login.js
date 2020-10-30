import request from "@utils/request";
const url_prefix = "/login";
export const reqSendCode = (phone) => {
  return request({
    method: "POST",
    url: `${url_prefix}/digits`,
    data: {
      phone,
    },
  });
};
