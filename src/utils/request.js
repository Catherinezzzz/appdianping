// 对网络请求进行基本的封装
// 封装两个方法： get(), post(), 分别用来进行GET和POST请求

const headers = new Headers({
  Accept: "application/json",
  "Content-type": "application/json",
});

/**
 * 封装基于fetch的GET请求
 * @param {*} url
 * @returns 请求成功，返回一个Promise(json()方法)；请求失败，返回Promise
 */
function get(url) {
  return fetch(url, {
    method: "GET",
    // 设置请求头
    // 一般一个应用前后端进行数据通信的基本格式都是统一的
    // 所以可以把headers的定义单独抽象出一个常量
    // 在本应用中，前后端传输数据的格式都使用JSON格式
    headers: headers,
  })
    .then((response) => {
      return handleResponse(response);
    })
    .catch((err) => {
      console.error(`Request failed. Url = ${err.url}`);
      return Promise.reject({
        error: { message: "Request failed." },
      });
    });
}

/**
 * 封装基于fetch的POST请求
 * @param {*} url
 * @param {*} data
 * @returns 返回Promise对象
 */
function post(url, data) {
  return fetch(url, {
    method: "POST",
    // 设置请求头
    // 一般一个应用前后端进行数据通信的基本格式都是统一的
    // 所以可以把headers的定义单独抽象出一个常量
    // 在本应用中，前后端传输数据的格式都使用JSON格式
    headers: headers,
    body: data,
  })
    .then((response) => {
      handleResponse(response);
    })
    .catch((err) => {
      console.error(`Request failed. Url = ${err.url}`);
      return Promise.reject({
        error: { message: "Request failed." },
      });
    });
}

/**
 * 处理fetch返回的response
 * @param {*} response
 * @returns 请求成功，返回一个Promise(json()方法)；请求失败，返回reject的Promise
 */
function handleResponse(response) {
  if (response.status === 200) {
    return response.json();
  } else {
    console.error(`Request failed. Url = ${response.url}`);
    // 为了让response可以继续调用下去，我们即使在异常的情况下，也返回一个Promise结构
    return Promise.reject({
      error: { message: "Request failed due to server error" },
    });
  }
}

export { get, post };
