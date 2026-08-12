---
title: Cpp学习
date: 2026-08-06
updated: 2026-08-07
category: Cpp
tags: [Cpp]
description: Cpp库学习
keywords: Cpp
---
## CPP配置文件
> VScode安装C/Cpp插件，Ctrl+Shift+P后搜C/C++，选择生成配置文件，文件名:c_cpp_properties.json
```json
{
    "configurations": [
        {
            "name": "MinGW",
            "includePath": [
                "${workspaceFolder}/src",
                "D:/deps_code/C_C++/mingw64/include/c++/15.2.0",
                "D:/deps_code/C_C++/mingw64/x86_64-w64-mingw32/include",
                "D:/deps_code/C_C++/vcpkg/installed/x64-mingw-dynamic/include"
            ],
            "compilerPath": "D:/deps_code/C_C++/mingw64/bin/g++.exe",
            "cStandard": "c17",
            "cppStandard": "c++17",
            "intelliSenseMode": "windows-gcc-x64"
        }
    ],
    "version": 4
}
```
- 编译器名：MinGW（也可以用MSVC）
- 编译器自带库路径：`<>`
- 包管理器路径：`<>`
- 编译器路径：`<>`
- C与Cpp标准：`<>`
---
## vector
> 标准库
> 动态数组，对标py的数组
```Cpp
std::vector<int> list = {1，2，3，4}                                // 一维数组
std::vector<std::vector<int>> grid(3, std::vector<int>(4, 0));      // 二维数组

// 方法
list.sort(list.begin(),list.end());     // 从头到尾排序
list.push_back(<数字>);                 // 尾部压入数字
list.pop_back(<数字>);                  // 尾部弹出数字
list.insert(<参数>);                    // 插入数字
list.erase(<参数>);                     // 删除数字
list.clear();                           // 清空
list.size();                            // 查询数组大小
list.empty();                           // 判断是否为空
list.capacity();                        // 计算已分配的内存能容纳多少数
list.reserve(<参数>);                   // 预分配空间
list.resize(<参数>);                    // 改变内存大小
list.shrink_to_fit();                   // 释放多余内存
// 遍历
for (size_t i = 0; i < v.size(); i++)
    fmt::print("[{}]={} ", i, v[i]);
```
---
## map
> 标准库
> Cpp的kv库，对标py的字典（不如py灵活）
> 如果是有序map，则为红黑树，如果是无序map，则为kv表
```Cpp
// 有序map
std::map<std::string,int> kv;                //创建一个名为kv的map映射表，表k为string类型，v为int类型

// 方法
kv['key'] = 1;                              //k-v的数据类型受到显示
kv.insert({'key',1});                       //insert方法
kv.erase('key');                            //erase方法
kv.size();                                  //size方法
kv.empty();                                 //empty方法
kv.clear();                                 //clear方法
if (m.find("key") != m.end())               //find方法返回迭代器
    fmt::print("找到了\n");
// 遍历，begin，end表示有序map的0/end
for (auto it = m.begin(); it != m.end(); ++it)
    fmt::print("{}: {}\n", it->first, it->second);    

// 无序map
std::unordered_map<std::string,int> kv;
```
---
## set
> 标准库
> 集合，对标py的set集合,不同点在于Cpp的集合可以修改
```Cpp
// 有序集合
std::set<int> set = [1,2,3]             // 不管你放入的元素是什么顺序，自带排序，py的集合也有这种特点

// 方法
set.insert(<>);
set.erase(<>);
set.size();
set.empty();
set.clear();

// 无序集合 <unordered_set>库
std::unordered_set<int> un_set = [1,2,3]        // 无序，哈希表

```
## string
> 标准库
> 提供了python字符串类型自带的那些一样的功能
1. string
    - 创建数据类型string
2. 拼接
    - 支持+拼接字符串
    - var_s1 + '' + var_s2
3. 追加
    - 支持append追加
    - var_s.append(`<内容>`)
4. 长度判断
    - 支持size与empty判断字符串长度
    - var_s.size()
        - 返回字节数
    - var_s.empty()
        - 返回布尔值
5. 分块取子串
    - 支持参数切割字符串
    - var_s.substr(`<参数>`)
6. 查找
    - 支持find查找
    - var_s.find(`<字符串>`)
    - 查找的是第一次出现的位置
7. 替换
    - 支持replace替换
    - var_s.replace(`<参数>`,`<字符串>`)
8. 插入
    - 支持insert插入字符串
    - var_s.insert(`<参数>`,`<字符串>`)
9. 删除
    - 支持erase删除字符串
    - var_s.erase(`<参数>`)

|参数|范围|
|---|---|
|n|下标索引|
|(m,n)|m到n|

---
## iostream
> 标准库
1. cout
2. cin
- 会这两个就行，out+in
---
## fstream
> 标准库
> 文件读写库
1. 打开模式

|模式|作用|
|---|---|
|in|读取|
|out|写入|
|app|追加|
|binary|二进制|

2. 写入
```Cpp
std::ofstream out('<文件名>');              //打开文件
out << '<内容>';                            //输出指定字符串，有缓冲区
out.close() ;                               //关闭文件
```
3. 读取
- 按行读
```Cpp
std::ifstream in('<文件名>')                 //打开文件
std::string var_s;                           //创建字符串变量
while (std::getline(in,var_s))               //in模式读取指定文件存于字符串变量
    std::fmt::print(var_s)                   //读一行输出一行
```
- 一次性全读完
```Cpp
std::ifstream in('<文件名>')                                         //打开文件
std::string var_s((std::istreambuf_iterator<char>(in)),             //太长了，懒得记，还以为是封装好的get_all
                     std::istreambuf_iterator<char>());             //大概率需要学习读写库的底层库，懒得学
std::fmt::print(var_s)                                              //读一行输出一行
```
- 追加写入
```Cpp
std::ofstream out("test.txt", std::ios::app);       //输出文件，模式，out+append，追加写入
out << "追加的一行\n";
``` 
- 二进制读写（暂时不需要）
- 检查文件是否存在->exist_file
```Cpp
bool file_exists(const std::string& path)       //取文件地址
{
    std::ifstream f(path);                      //尝试流式写入
    return f.good();                            //判断是否正常写入
}
```
---
## sstream
> 标准库
> 用于字符串拼接与转换，iss流出（空格分）。oss流入（转str）
1. 拼接
    - 这个用fmt库更优雅，不用这个，标准库：std::ostringstream     OSS,输出字符串流
```Cpp
std::ostringstream oss;                             // 创建字符串流
oss<<'<字符串>'<< <数字> <<'<字符串>';               // 流入字符串
std::string res = oss.str();                        // 将字符流转换为字符串
```    
2. 字符串转数字
```Cpp
std::istringstream iss("42 3.14 hello");            // iss流出字符串
int i;
double d;
std::string s;

iss >> i;    // i = 42
iss >> d;    // d = 3.14
iss >> s;    // s = "hello"
```
3. 数字转字符串
    - oss
    - 'std::to_String(<数字>)'
4. 字符串拆分
```Cpp
// 1. 符号拆分
std::string line = "apple,banana,cherry";
std::string token;
std::vector<std::string> tokens;

// 按逗号拆分
std::istringstream iss(line);
while (std::getline(iss, token, ','))       // 以，为结尾为一行拆分iss流，取token存入数组
    tokens.push_back(token);    

// 2. 空格拆分
std::istringstream iss("hello world foo bar");
std::string word;
while (iss >> word)
    fmt::print("{}\n", word);               // iss流遇到空格自带划分
```
---
## fmt
> 第三方库。只能输出
> 导入 `#include <fmt/<子文件>>` ->如果是用包管理器vcpkg，需要在配置json写出其位置
1. core.h
    1. print()
        - 格式化输出 
        - {},{},{} 支持参数传递
2. color.h
    1. fg frontgroud前景色
        - print(fmt::fg(fmt::color:;`<颜色>`),`<字符串>`)
    2. bg background背景色
        - print(fmt::bg(fmt::color:;`<颜色>`),`<字符串>`)
---
## cstring
> C标准库的Cpp封装
> 用于内存操作与C风格的字符串操作（在这里只说内存操作）
1. memset(memory set -> 内存填充)
```Cpp
//给目标指针地址填充num_size大小的value字符
void* memset(void* ptr, int value, size_t num);     
// 1. 清空结构体
struct config {
    int width;
    int heigh;
    std::string des;
}
config test;                            //创建结构体变量
std::memset(&test,0,sizeof(config));    //取变量地址赋初值0

// 2. 填充缓冲区
int suffer[1000];
std::memset(suffer,'A',100)
```
2. memcpy(memory copy -> 内存拷贝)
```Cpp
// 由源码copy到dist
void* memcpy(void* dest, const void* src, size_t num); 

// 示例:
std::memcpy(dist,src,5*sizeof(int))
```
3. memcmp(memory compare -> 内存比较)
```Cpp
// 比较两个地址的数值
int memcmp(const void* ptr1, const void* ptr2, size_t num);

// 1.比较两个图片数据的哈希
unsigned char* hash1 = compute_hash(data1);
unsigned char* hash2 = compute_hash(data2);
if (std::memcmp(hash1, hash2, 32) == 0)  // 比较 32 字节的哈希
    fmt::print("图片内容相同\n");

// 2.检查配置是否一致
if (std::memcmp(&config1, &config2, sizeof(Config)) != 0)
    fmt::print("配置已更改\n");
```
4. memmove(momery move -> 移动内存)
```Cpp
// 将指定字节数的源地址的数据移动到目标地址，与copy相比，能操作重复地址的内存
void* memmove(void* dist, const void* src, size_t num);

// 在数组中移动元素（重叠场景）
int arr[] = {1, 2, 3, 4, 5, 6, 7};
// 将 arr[2..4] 移动到 arr[0..2]
std::memmove(arr, arr + 2, 3 * sizeof(int));  // arr = {3, 4, 5, 4, 5, 6, 7}
```
---
## cmath
> 标准库
> 一些简单的数学公式
1. 取整
    - `round(<num>)`
    - `floor(<num>)`
    - `ceil(<num>)`
    - `trunc(<num>)`
2. 方根运算
    - `pow(<num>,<num>)`
    - `sqrt(<num>)`
    - `cbrt(<num>)`
    - `hypot(<num>,<num>)`
3. 绝对值
    - `abs(<num>)`
    - `fabs(<num>)`
4. 三角函数
    - `sin(<num>)`
    - `cos(<num>)`
    - `tan(<num>)`
    - `asin(<num>)`
    - `acos(<num>)`
    - `atan(<num>)`    
5. 指对运算
    - `exp(<num>)`
    - `log(<num>)`
    - `log10(<num>)`
    - `log2(<num>)`
6. 最值运算
    - `min(<num>,<num>)`
    - `max(<num>,<num>)`
---
## ctime
> 标准库
> 时间戳，年月日时分秒相关库
1. 数据类型
    - 时间戳time_t
    - 结构体tm
2. API
```Cpp
// 1. 获取当前时间
std::time_t now = std::time(nullptr);

// 2. 转化为字符串
char* time_str = std::ctime(&now);

// 3. 格式化时间（1.创建容器，2.获取当地时间，3.格式化输出）
char buffer[64];
std::tm* local = std::localtime(&now);
std::strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S", local);
```
---
## csignal
> 标准库
> 专用于捕获操作系统指令集信号
1. 用法（状态机）
```cpp
// 全局标志位（用于信号处理与主循环通信）
volatile sig_atomic_t g_running = 1;

// 信号处理函数
void signal_handler(int signal) 
{
    if (signal == SIGINT) {g_running = 0;}
}

int main()
{
    // 注册信号处理函数
    std::signal(SIGINT, signal_handler);

    while (g_running) {/*<功能>*/}

    return 0;
}
```
2. 指令集

|指令|作用|
|---|---|
|SIGINT|中断信号（Ctrl+C）|
|SIGTERM|终止请求（kill 命令默认）|
|SIGABRT|异常终止（abort() 函数调用）|
|SIGFPE|算术异常（除以零、溢出）|
|SIGILL|非法指令|
|SIGSEGV|段错误（访问非法内存）|
|SIGBUS|总线错误|
|SIGPIPE|写无读者的管道|

---
## cstdlib
> 标准库
> 与系统信息和系统交互有关
1. 查询环境变量
    - 关于环境变量：
        - 挂载shell解释器子程序，注册shell子命令
        - 一些系统级参数/文件夹路径
```Cpp
// 获取环境变量
const char*var = std::get_env('PATH');
if(var) {fmt::print("环境变量存在{}"，var)}
else {fmt::print('环境变量不存在/n')}
// 封装成字符串获取
std::string get_env_or_default(const std::string& key, const std::string& default_val) 
{
    const char* val = std::getenv(key.c_str());
    return val ? std::string(val) : default_val;
}
```
2. 执行系统命令
```Cpp
int result = std::system("ls -la");         // Linux/macOS
int result_windows = std::system("dir");    // Windows

// 检查执行结果
if (result == 0) {fmt::print("命令执行成功\n");}
else {fmt::print(fmt::fg(fmt::color::red), "命令执行失败，退出码: {}\n", result);}
```
---
## cctype
> 标准库
> 判断/转换大小写
1. 判断类 
    - `std::isalpha(c)`   // 是否为字母 (a-z, A-Z)
    - `std::isdigit(c)`   // 是否为数字 (0-9)
    - `std::isalnum(c)`   // 是否为字母或数字
    - `std::isspace(c)`   // 是否为空白字符 (空格、tab、换行等)
    - `std::ispunct(c)`   // 是否为标点符号
    - `std::isupper(c)`   // 是否为大写字母
    - `std::islower(c)`   // 是否为小写字母
    - `std::iscntrl(c)`   // 是否为控制字符
    - `std::isgraph(c)`   // 是否为可打印字符（除空格）
    - `std::isprint(c)`   // 是否为可打印字符（含空格）
    - `std::isxdigit(c)`  // 是否为十六进制数字 (0-9, a-f, A-F)
2. 转换
    - `std::tolower(c)`   // 转换为小写
    - `std::toupper(c)`   // 转换为大写
---
> 编辑于2026-08-07

> 作者：Cnkrru

> 联系方式：3253884026@qq.com

