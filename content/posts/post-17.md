---
title: Frontend-获取后端API的数据
date: 2026-08-10
category: 前端
tags: [前端]
description: 介绍前端如何获取后端返回的数据
keywords: frontend
---
## IPAPI
### 制作方法
1. 公开免费的IPAPI
    - [https://ipinfo.io/](https://ipinfo.io/)
        - [https://ipinfo.io/json](https://ipinfo.io/json)
    - [https://www.ipify.org/](https://www.ipify.org/)
        - [https://api.ipify.org?format=json](https://api.ipify.org?format=json)
> 父级是官网地址,子级是API地址
2. 调用
    - 通过CDN调用axios:`<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>`
    - 拿到数据自己写逻辑渲染到HTML上即可
3. API返回数据格式(很多情况下是json)
示例:
```json
{
  "ip": "131.143.239.174",
  "city": "Hoi Fu Court",
  "region": "Yau Tsim Mong District",
  "country": "HK",
  "loc": "22.3163,114.1647",
  "org": "AS12198 JSMSR Network",
  "postal": "999077",
  "timezone": "Asia/Hong_Kong",
  "readme": "https://ipinfo.io/missingauth"
}
```  
> 对于json的处理，JavaScript的处理方式暂时没学，不过作者学过py,py的字典本来和json就是一个样子,用点语法来接收数据  
### 代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    .IP-container {
        width: 100px;
        height: 50px;
        background-color: pink;
        border-radius: 5px;
    }
    </style>
</head>
<body>
    <div class="IP-container"></div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        function updateIP(city) {
            const ipbox = document.querySelector('.IP-container');
            ipbox.textContent = `City: ${city}`;
            console.log(`[INFO]:已成功渲染IP信息`);
        }
        axios.get('https://ipinfo.io/json')
            .then(function (response) {
                console.log(`[INFO]:City -> ${response.data.city}`);
                const city = response.data.city;
                updateIP(city);
            })
            .catch(function (error) {
                console.log(error);
            });
    </script>
</body>
</html>
```
---
## 天气API
### 制作方法
1. axios获取到的IP数据拿出需要的，传给weatherAPI
2. API:`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
    - 两个`${}`是需要填充的数据
### 代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    .container {
        width: 200px;
        height: 80px;
        background-color: pink;
        border-radius: 5px;
        padding: 10px;
        font-size: 14px;
    }
    </style>
</head>
<body>
    <div class="container"></div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        function updateIP(city) {
            const ipbox = document.querySelector('.container');
            ipbox.textContent = `City: ${city}`;
            console.log(`[INFO]:已成功渲染IP信息`);
        }

        function updateWeather(lat, lon) {
            const weatherbox = document.querySelector('.container');
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
                .then(function (response) {
                    const temperature = response.data.current.temperature_2m;
                    weatherbox.textContent += ` | Temp: ${temperature}°C`;
                    console.log(`[INFO]:已成功渲染天气信息`);
                })
                .catch(function (error) {
                    console.log('天气API请求失败:', error);
                });
        }

        axios.get('https://ipinfo.io/json')
            .then(function (response) {
                console.log(`[INFO]:City -> ${response.data.city}`);
                console.log(`[INFO]:Location -> ${response.data.loc}`);
                
                const city = response.data.city;
                const [lat, lon] = response.data.loc.split(',').map(Number);
                
                updateIP(city);
                
                updateWeather(lat, lon);
            })
            .catch(function (error) {
                console.log('IP API请求失败:', error);
            });
    </script>
</body>
</html>
```
---
## GITHUB API
### 制作方法
1. API地址
    - `https://api.github.com/users/<username>`
    - 示例以我的实际API作为例子:username = Cnkrru
2. 数据格式
    - 数据很多，这里只显示其中两个，数据都是公开的
```json
{
  "login": "Cnkrru",
  "id": 233513911
}
```
### 代码
> 使用时替换为自己的username，想要什么数据自己拿，自己渲染
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    .container {
        width: 100px;
        height: 50px;
        background-color: pink;
        border-radius: 5px;
    }
    </style>
</head>
<body>
    <div class="container"></div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        const githubbox = document.querySelector('.container');
        axios.get('https://api.github.com/users/<username>')
            .then(function (response) {
                console.log(`[INFO]:Name -> ${response.data.name}`);
                const name = response.data.name;
                githubbox.textContent = `Name: ${name}`;
                console.log(`[INFO]:已成功渲染GitHub信息`);
            })
            .catch(function (error) {
                console.log(error);
            });
    </script>
</body>
</html>
```
---
> 编辑于2026-08-11

> 作者：Cnkrru

> 联系方式：3253884026@qq.com