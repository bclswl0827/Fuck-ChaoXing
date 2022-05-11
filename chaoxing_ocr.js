// ==UserScript==
// @name         学习通搜题小助手
// @description  学习通搜题小助手
// @version      v1.0.0
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/dom-to-image@2.6.0/dist/dom-to-image.min.js
// @match        https://mooc1.chaoxing.com/work/doHomeWorkNew*
// @run-at       document-end
// ==/UserScript==

var encText;

// 生成页面内联函数
function geneFunction(ocrEnabled, encText) {
    return 'var ocrEnabled = ' + ocrEnabled + ',' +
        'encText = ' + encText + ';' +
        // 获取图片 ID 存入数组，然后开始 OCR
        `var quizImg=document.querySelectorAll('img[alt="chaoxing_nmsl"]');quizImg.forEach(function(e,t,n){encText[t].innerText="正在修复乱码问题以便后续搜题，请稍候..."});var imgList=[];setTimeout(function(){for(var e=document.querySelectorAll('img[alt="chaoxing_nmsl"]'),t=0;t<e.length;t++)imgList.push(t);if(0<imgList.length){async function n(){for(var e in imgList){var{data:{text:t}}=await async function(e){return await Tesseract.recognize(e,"eng+chi_sim")}(document.querySelectorAll('img[alt="chaoxing_nmsl"]')[e].src);encText[e].innerText=t,encText[e].style.color="black",console.log(t)}}n()}},2e3);`;

    // 未压缩代码
    /*
// 遍历 img 标签，替换对应题目文字
var quizImg = document.querySelectorAll('img[alt="chaoxing_nmsl"]');
quizImg.forEach(function(item, index, arr) {
    encText[index].innerText = '正在修复乱码问题以便后续搜题，请稍候...';
});

// 获取图片 ID 存入数组
var imgList = [];

setTimeout(function() {
    var imgTag = document.querySelectorAll('img[alt="chaoxing_nmsl"]');
    for (var i = 0; i < imgTag.length; i++) {
        imgList.push(i);
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
                console.log(text);
            }
        }
        async function recText(img) {
            return await Tesseract.recognize(img, 'eng+chi_sim');
        }
        displayText();
    }
}, 2000);
    */
}

function prettyText() {
    var _encText = document.getElementsByClassName('font-cxsecret');
    if (_encText) {
        [].forEach.call(_encText, function(item, index, arr) {
            arr[index].innerText = arr[index].innerText.replace(/[\r\n]/g, '').replace(/\ +/g, '');
        });
    }
    return prettyText;
}
setInterval(function() {
    prettyText()
}, 1000);

// 根据情况向 HTML 中灌入 JS
if (document.getElementsByClassName('font-cxsecret')[0]) {
    console.log('在页面中检测到加密文本');
    ocrEnabled = true;
    encText = `document.getElementsByClassName('font-cxsecret');`;
    var encArray = document.getElementsByClassName('font-cxsecret');
    // 将 DOM 转换为 Base64 图片
    [].forEach.call(encArray, function(item, index, arr) {
        // 改大字体、加入空格便于识别
        if (arr[index].className == 'font-cxsecret fl after') {
            arr[index].style = 'line-height: 90px; font-size: 50px; color: black; letter-spacing: 5px;';
        } else {
            arr[index].style = 'line-height: 90px; font-size: 50px; letter-spacing: 5px;';
        }
        // domtoimage.toJpeg(arr[index], {
        //     quality: 1.0,
        //     bgcolor: '#fff'
        // }).then(function(dataUrl) {
        //     var img = new Image();
        //     img.src = dataUrl;
        //     img.alt = 'chaoxing_nmsl';
        //     img.style = 'display:none;';
        //     img.id = index;
        //     document.body.appendChild(img);
        // });
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
                encArray[count].style = 'padding-left:10px; color: red;';
                encArray[count].innerText = '正在修复乱码问题，以便后续搜题，这可能需要一些时间...';
            } else {
                encArray[count].style = 'line-height: 35px; font-size: 14px; padding-right: 15px; color: red;';
                encArray[count].innerText = '正在修复乱码问题，以便后续搜题，这可能需要一些时间...';
            }
            console.log('生成第 ' + count++ + ' 个用于 OCR 辨识的图像');
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
        importOcr.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/2.1.5/tesseract.min.js';
        pageHead.appendChild(importOcr);
        // 生成内联函数并执行 OCR 识别任务
        extScript.innerText = geneFunction(ocrEnabled, encText);
        pageHead.appendChild(extScript);
    }, 1000);
} else {
    console.log('没有检测到加密文本');
}
