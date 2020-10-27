import axios from "axios";
const requset = axios.create({
  baseURL: "/api",
  timeout: 2000,
});
//定义请求拦截器
// xxx.interceptors.request.use(()=>{},()=>{})
// 第二个参数是用来处理失败的
// 请求拦截是后拦截的先执行，当前拦截失败后，会进入到下一个拦截的第二个参数中
requset.interceptors.request.use((config) => {
  return config;
});
//定义响应拦截器--1、判断响应具体是成功还是失败   2、返回更加具体的错误提示
requset.interceptors.response.use(
  //首先根据响应状态码决定响应是成功还是失败，响应成功对应的状态码是2xx,即200-299
  //响应成功
  (response) => {
    //响应成功，再判断是否功能成功，功能是否成功，看响应结果的code，就是后台数据库中定义的code
    //该项目code是20000才功能成功
    if (response.data.code === 20000) {
      return response.data.data;
    } else {
      return Promise.reject(response.data.messages);
    }
  },
  //响应失败，即响应状态码为非2xx
  (error) => {
    //响应失败有可能是服务器没有返回响应，也有可能是服务器返回了响应，但响应是失败的
    //通过error.message.status可以获取响应状态码
    //401:(Unauthorization未授权，没有权限访问)--没有token或者token失效/过期
    //404（找不到资源）--请求地址写错了
    //403：（禁止访问forbidden）
    //500:(服务器内部错误)
    //error.message存在，则代表服务器返回了响应，有响应状态码
    if (error.message) {
      if (error.message.status === 401) {
      }
    } else {
      //error.message不存在，则代表服务器没有返回响应--请求超时（timeout）或者网络错误（network error）
    }
  }
);
