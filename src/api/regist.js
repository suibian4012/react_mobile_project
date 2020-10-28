import request from "@utils/request";
const url_prefix = "/regist";
export const reqVerifyPhone = (phone) => {
  return request({
    method: "POST",
    url: `${url_prefix}/verify_phone`,
    data: {
      phone,
    },
  });
};
