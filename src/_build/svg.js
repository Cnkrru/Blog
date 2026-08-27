import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const file_name = fileURLToPath(import.meta.url)                                        // 当前脚本所在位置
const dir_name = path.dirname(file_name)                                                // 取file_name的路径的文件夹目录
const father_dir = path.resolve(dir_name,'..')                                          // 解析为绝对路径
const svg_dir = path.join(father_dir,'assets','svg')                                    // 拼接svg源文件目录
const output_file = path.join(father_dir,'assets','svg-icon-map.js')                    // 拼接svg-map输出目录

let count = 0;

// console.log(`url地址为:${file_name}`)           // 调试代码
// console.log(`dir_name = ${dir_name}`)           // 调试代码
// console.log(`project_root = ${project_root}`)   // 调试代码
// console.log(`svg_dir = ${svg_dir}`)             // 调试代码
// console.log(`output_path = ${output_file}`)     // 调试代码


// 可继承属性
const inherit_css = new Set(
    [
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-dasharray',
    'stroke-dashoffset',
    'fill-opacity',
    'fill-rule',
    'clip-rule'
    ]
)

/*
* id: 
* fn: 
*/
function to_current_color(value) 
{
    try {
        const _ = value.trim()
        // 如果为空,返回value
        if (!_)
            return value;
        // 如果为none,current_color,transparent,以url(开头，返回value
        if (_ === 'none' || _ === 'currentColor' || _ === 'transparent' || _.startsWith('url(')) 
            return value;
        // 如果以#,rgb,hsl,开头,返回current_color
        if (_.startsWith('#') || _.startsWith('rgb') || _.startsWith('hsl') || /^[a-z]+$/i.test(_)) 
            return 'currentColor';
        console.log('[INFO]:')
        return value
    }
    catch {
        console.error('[err]:')
    }
}

/*
* id: 解析svg源文件
* fn: 解析svg源码，输出为json字段
*/
function parse_svg(raw)
{
    // 匹配svg标签代码块
    const _ = raw.match(/<svg([^>]*?)>/i);
    // 如果为空,返回默认空值
    if (!_) 
        return { viewBox : "",attrs: {}, body: raw};
    // 解析结果变量
    let body = raw.slice(_[0].length).replace(/<\/svg>\s*$/i,'').replace(/<!--[\s\S]*?-->/g,'');
    const css = {};
    let viewBox = '';
    const cssRe = /([a-zA-Z-]+)="([^"]*)"/g;
    let m;
    // 参数解析
    try {
        while ((m = cssRe.exec(_[1])) !== null)
        {
            const name = m[1];
            const value = m[2];
            if (name === 'viewBox')
                viewBox = value;
            else if (name === 'width' || name === 'height')
                continue;
            else if (name === 'fill' || name === 'stroke')
                css[name] = to_current_color(value);
            else if (inherit_css.has(name))
                css[name] = value;
        }
        // console.log('[INFO]:svg参数解析成功')
        count++;
    }
    catch {
        console.error('[ERR]:svg参数解析失败')
    }

    body = body.replace(/(fill|stroke)="([^"]*)"/g,(_match,prop,value) => `${prop}="${to_current_color(value)}"`);

    return {viewBox,css,body}
}

/*
* id: svg文件解析注入配置文件
* fn: 将svg解析为json格式，注入到svg-icon-map.js
*/
function file_to_map()
{
    const icons = {};
    // 读取解析svg
    try {
        // 异步读取svg源文件夹的文件,只读取拓展名为svg的文件
        const files = fs.readdirSync(svg_dir).filter(f => f.endsWith('.svg')).sort()
        for (const file of files)
        {
            const raw = fs.readFileSync(path.join(svg_dir,file),'utf-8');
            icons[file] = parse_svg(raw);
        }
        // console.log('[INFO]:读取文件成功，解析成功')
    }
    catch {
        // console.error(`[ERROR]:读取svg源文件失败,请检查路径是否正确,路径为:${svg_dir}`)
    }
    // 将解析结果输出到目标文件
    try {
        const output = 'export default'+JSON.stringify(icons,null,2);
        fs.writeFileSync(output_file,output,'utf-8');
        console.log(`总共解析${count}个svg`)
        console.log(`[INFO]:已输出至目标文件,路径为:${output_file}`)
    }
    catch {
        // console.error('[ERROR]:未生成配置文件,请检查日志')
    }
}

function main()
{
    console.log('====================');
    file_to_map();
    console.log('====================');
}

main();