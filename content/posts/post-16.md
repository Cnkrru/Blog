---
title: Frontend-WebAPI-Fetch
date: 2026-08-10
category: 前端
tags: [前端]
description: 介绍前端如何获取后端返回的数据
keywords: frontend
---
## Fetch API
> fetchAPI用于与后端进行数据来往
- 前端JS内置库，支持异步
- 请求类型

|请求|作用|
|---|---|
|get|获取数据|
|post|发送数据|
|put|更新数据（全部）|
|patch|更新数据（局部）|
|delete|删除数据|

- 直接写fetch太麻烦了，一般用axios库，是封装好的请求库
---
## axios
> 文档:[axios中文文档](https://axios.org.cn/docs/intro)
> 第三方文档:[axios第三方hugo文档](http://www.axios-js.com/zh-cn/docs/index.html)
### axios API
1. axios(config)
```javascript
// 发送 POST 请求
axios({
    method: 'post',
    url: '/user/12345',
    data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
    }
});
```
2. 各种方法对应函数
`axios.<类型>(<参数>)`

|类型|参数|
|---|---|
|request|config|
|get|url,[config]|
|delete|url,[config]|
|head|url,[config]|
|options|url,[config]|
|post|url,[data,[config]]|
|put|url,[data,[config]]|
|patch|url,[data,[config]]|

3. 并发处理函数
    - `axios.all(<参数>)`
    - `axios.spread(<参数>)`
示例:
```javascript
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
  }));
```
### 注意事项
1. axios默认异步
2. axios在`.then()`中的数据默认不外用，涉及调用API获取的数据，最好在`then`工作域内完成操作
---
> 编辑于2026-08-10

> 作者：Cnkrru

> 联系方式：3253884026@qq.com