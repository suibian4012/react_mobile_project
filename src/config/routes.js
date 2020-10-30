import VerifyPhone from "@pages/regist/VerifyPhone";
import VerifyCode from "@pages/regist/VerifyCode";
import VerifyPassword from "@pages/regist/VerifyPassword";
import CountryPicker from "@components/CountryPicker";
const routes = [
  {
    path: "/regist/verifyPhone",
    component: VerifyPhone,
    exact: true,
  },
  {
    path: "/regist/verifycode",
    component: VerifyCode,
    exact: true,
  },
  {
    path: "/regist/verifypassword",
    component: VerifyPassword,
    exact: true,
  },
  {
    path: "/common/countryData",
    component: CountryPicker,
    exact: true,
  },
];

export default routes;
