const https = require('https');

const API_URL = "https://88.lxmusic.xn--fiqs8s";
const API_KEY = "lxmusic";
const API_PATH = "/v4/url"; // 正确的v4路径

// 测试函数
async function getMusicUrl(source, songId, quality) {
    const url = `${API_URL}${API_PATH}/${source}/${songId}/${quality}`;
    console.log(`\n=== 测试 ${source} - ${songId} - ${quality} ===`);
    console.log(`请求URL: ${url}`);
    
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Request-Key': API_KEY,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };
        
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`状态码: ${res.statusCode}`);
                try {
                    const result = JSON.parse(data);
                    if (result.code === 0 && result.data) {
                        console.log(`音乐链接: ${result.data}`);
                        console.log(`额外信息: ${JSON.stringify(result.extra || {})}`);
                        resolve(result.data);
                    } else {
                        console.log(`错误: ${result.msg || '获取失败'}`);
                        reject(new Error(result.msg || '获取失败'));
                    }
                } catch (error) {
                    console.log(`响应: ${data}`);
                    console.log(`解析错误: ${error.message}`);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.log(`请求错误: ${error.message}`);
            reject(error);
        });
    });
}

// 测试用例
async function runTests() {
    console.log('=== 洛雪音乐v4 API测试 ===\n');
    
    const testCases = [
        // 网易云音乐
        { source: 'wy', songId: '1869042078', quality: '128k' },  // 周杰伦 - 稻香
        { source: 'wy', songId: '1869042078', quality: '320k' },
        { source: 'wy', songId: '1869042078', quality: 'flac' },
        // 腾讯音乐
        { source: 'tx', songId: '003OUlho2HcRHC', quality: '128k' },  // 示例歌曲
        // 酷我音乐
        { source: 'kw', songId: '29764666', quality: '128k' },  // 示例歌曲
    ];
    
    for (const testCase of testCases) {
        try {
            await getMusicUrl(testCase.source, testCase.songId, testCase.quality);
        } catch (error) {
            console.log(`测试失败: ${error.message}`);
        }
        console.log('---');
    }
}

// 运行测试
runTests();
