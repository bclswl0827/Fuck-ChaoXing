// ==UserScript==
// @name         学习通搜题小助手
// @description  学习通搜题小助手
// @version      v1.0.3
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      https://unpkg.com/dom-to-image@2.6.0/dist/dom-to-image.min.js
// @match        https://mooc1.chaoxing.com/work/doHomeWorkNew*
// @run-at       document-end
// ==/UserScript==

// 生成页面内联函数
function geneFunction(ocrEnabled, encText) {
    return 'var ocrEnabled = ' + ocrEnabled + ',' +
        'encText = ' + encText + ';' +
        `var imgList=[],_imgList=[];setTimeout(function(){for(var e=document.querySelectorAll('img[alt="chaoxing_nmsl"]'),t=0;t<e.length;t++)imgList.push(t),_imgList.push(t);if(0<imgList.length){async function i(){for(var e in imgList){var{data:{text:t}}=await async function(e){return await Tesseract.recognize(e,"chi_sim",{langPath:"https://c.ibcl.us/ocr-lib"})}(document.querySelectorAll('img[alt="chaoxing_nmsl"]')[e].src);encText[e].innerText=t,encText[e].style.color="black",_imgList.shift(),console.log(t)}}i()}},2e3);var pageHead=document.querySelector('div[class="ZyTop"]');setInterval(function(){var e;0<_imgList.length&&((e=document.querySelector('p[id="ocrProgress"]'))?e.innerHTML="<strong>当前进度：第 "+(_imgList[0]+1)+"/"+imgList.length+" 个</strong>":((e=document.createElement("p")).id="ocrProgress",pageHead.appendChild(e)))},500);`;

// 未压缩代码
/*
// 获取图片 ID 存入数组
var imgList = [],
    _imgList = [];
// 启动 OCR
setTimeout(function() {
    var imgTag = document.querySelectorAll('img[alt="chaoxing_nmsl"]');
    for (var i = 0; i < imgTag.length; i++) {
        imgList.push(i);
        _imgList.push(i);
    }
    if (imgList.length > 0) {
        async function displayText() {
            for (var img in imgList) {
                const {
                    data: {
                        text
                    }
                } = await recText(document.querySelectorAll('img[alt="chaoxing_nmsl"]')[img].src);
                encText[img].innerText = text;
                encText[img].style.color = 'black';
                _imgList.shift(); // 用于统计剩下的任务
                console.log(text);
            }
        }
        async function recText(img) {
            return await Tesseract.recognize(
                img,
                'chi_sim', {
                    langPath: 'https://c.ibcl.us/ocr-lib'
                });
        }
        displayText();
    }
}, 2000);
// 统计 OCR 任务
var pageHead = document.querySelector('div[class="ZyTop"]');
setInterval(function() {
    if (_imgList.length > 0) {
        var currentProgress = document.querySelector('p[id="ocrProgress"]');
        if (!currentProgress) {
            var ocrProgress = document.createElement('p');
            ocrProgress.id = 'ocrProgress';
            pageHead.appendChild(ocrProgress);
        } else {
            currentProgress.innerHTML = '<strong>当前进度：第 ' + (_imgList[0] + 1) + '/' + imgList.length + ' 个</strong>';
        }
    }
}, 500);
*/
}

function prettyText() {
    var _encText = document.getElementsByClassName('font-cxsecret');
    if (_encText) {
        // 透过正则纠正一部分字符串，提高题目匹配成功率
        [].forEach.call(_encText, function(item, index, arr) {
            // 移除空格和换行
            arr[index].innerText = arr[index].innerText.replace(/[\r\n]/g, '').replace(/\ +/g, '');
            // 半角符号转全角
            arr[index].innerText = arr[index].innerText.replace(/\[/g, '【').replace(/\]/g, '】');
            // 碰到两个相同方向双引号，则替换为「“”」
            //arr[index].innerText = arr[index].innerText.replace(/(?<=“).*?(?=“)/, '“$2”');
            // 句号误判为 o，自动转句号
            //arr[index].innerText = arr[index].innerText.replace(/(.{3}$)/g, arr[index].innerText.match(/(.{3}$)/g)[0].replace(/o/g, '。'));
            // 显示最终结果
            arr[index].innerText = arr[index].innerText;
        });
    }
    return prettyText;
}
setInterval(prettyText(), 1000);

// 根据情况向 HTML 中灌入 JS
if (document.getElementsByClassName('font-cxsecret')[0]) {
    console.log('在页面中检测到加密文本');
    var encText = `document.getElementsByClassName('font-cxsecret');`;
    var encArray = document.getElementsByClassName('font-cxsecret');
    // 将 DOM 转换为 Base64 图片
    [].forEach.call(encArray, function(item, index, arr) {
        // 改大字体、加入空格便于识别
        if (arr[index].className == 'font-cxsecret fl after') {
            arr[index].style = 'line-height: 80px; font-size: 40px; color: red; letter-spacing: 3px;';
        } else {
            // 为题目括号增大间距，避免识别错误
            arr[index].innerText = arr[index].innerText.replace(/(\()(\))/g, '    $1 $2');
            arr[index].style = 'line-height: 80px; font-size: 40px; color: red; letter-spacing: 3px;';
        }
    });
    // 按顺序生成图像
    var count = 0;
    async function genImg() {
        for (let num of encArray) {
            const url = await convertImg(num);
            var img = new Image();
            img.src = url;
            img.alt = 'chaoxing_nmsl';
            img.style = 'display:none;';
            img.id = count;
            document.body.appendChild(img);
            if (encArray[count].className == 'font-cxsecret fl after') {
                encArray[count].style = 'padding-left: 10px; color: red;';
                encArray[count].innerText = '正在修复乱码问题，以便后续搜题，这可能需要一些时间...';
            } else {
                encArray[count].style = 'line-height: 35px; font-size: 14px; padding-right: 15px; color: red;';
                encArray[count].innerText = '正在修复乱码问题，以便后续搜题，这可能需要一些时间...';
            }
            console.log('生成第 ' + ++count + ' 个用于 OCR 辨识的图像');
        }
    }
    async function convertImg(num) {
        return await domtoimage.toJpeg(num, {
            quality: 1.0,
            bgcolor: '#fff'
        });
    }
    genImg();

    // 为页面引入 Tesseract.js
    setTimeout(function() {
        var pageHead = document.getElementsByTagName('head')[0],
            importOcr = document.createElement('script'),
            extScript = document.createElement('script');
        importOcr.src = 'https://unpkg.com/tesseract.js@2.1.5/dist/tesseract.min.js';
        pageHead.appendChild(importOcr);
        // 生成内联函数并执行 OCR 识别任务
        extScript.innerText = geneFunction(true, encText);
        pageHead.appendChild(extScript);
    }, 1000);
} else {
    console.log('没有检测到加密文本');
}
