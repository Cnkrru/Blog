---
title: C_Cpp学习2
date: 2026-08-07
category: C_Cpp
tags: [C,Cpp]
description: C库学习
keywords: C
---
# C_Cpp学习日志2
---
> C一般用于硬件，操作系统（比如单片机，liunx）
> Cpp兼容C，一些Cpp库是基于C库，进一步封装
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
    - round(<num>)
    - floor(<num>)
    - ceil(<num>)
    - trunc(<num>)
2. 方根运算
    - pow(<num>,<num>)
    - sqrt(<num>)
    - cbrt(<num>)
    - hypot(<num>,<num>)
3. 绝对值
    - abs(<num>)
    - fabs(<num>)
4. 三角函数
    - sin(<num>)
    - cos(<num>)
    - tan(<num>)
    - asin(<num>)
    - acos(<num>)
    - atan(<num>)    
5. 指对运算
    - exp(<num>)
    - log(<num>)
    - log10(<num>)
    - log2(<num>)
6. 最值运算
    - min(<num>,<num>)
    - max(<num>,<num>)
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
