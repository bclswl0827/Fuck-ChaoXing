// ==UserScript==
// @name         绕过超星人脸验证
// @description  绕过超星人脸验证
// @version      v1.2.0
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy*
// @run-at       document-end
// ==/UserScript==

// 移除人脸认证窗口
function removePop() {
    var popWindow = document.getElementsByClassName('popDiv wid640')[0];
    if (popWindow) {
        popWindow.parentNode.removeChild(popWindow);
        document.getElementsByClassName('maskDiv')[0].className = 'Fuck';
    }
    return removePop;
}

// 100 毫秒检查一次
setInterval(removePop(), 100);

// 获取课程 URL
function fetchClass() {
    var myCourse = [];
    for (var i = 0; i < document.getElementsByTagName('span').length; i++) {
        var urlEvent = document.getElementsByTagName('span')[i].attributes.onclick;
        if (urlEvent)
            if (urlEvent.nodeValue.includes('getTeacherAjax'))
                myCourse.push(urlEvent.nodeValue.replace('getTeacherAjax', 'genUrl'));
    }
    return myCourse;
}

// 为课程加上序号
function showOrder() {
    var urlTag = document.getElementsByTagName('span'), count = 1;
    for (var i = 0; i < document.getElementsByTagName('span').length; i++) {
        if (urlTag) {
            var urlEvent = document.getElementsByTagName('span')[i].attributes.onclick;
            if (urlEvent)
                if (urlEvent.nodeValue.includes('getTeacherAjax') && !urlTag[i].innerText.includes('第 ')) {
                    urlTag[i].innerText = '第 ' + count++ + ' 课';// - ' + urlTag[i].innerText;
                }
        }
    }
    return showOrder;
}

// 1 秒获取一次
var myCourse;
setInterval(function() {
    myCourse = fetchClass();
    showOrder();
}, 1000);

// 构造课程 URL
function genUrl(courseId, classId, knowledgeId) {
    // 获取页面资讯
    var curCpi = document.getElementById('curCpi').attributes.value.value;
    // 打开影片
    var video = 'https://mooc1.chaoxing.com/knowledge/cards' +
        '?clazzid=' + classId +
        '&courseid=' + courseId +
        '&knowledgeid=' + knowledgeId +
        '&num=0' +
        '&ut=s' +
        '&cpi=' + curCpi +
        '&v=20160407-1';
    // 打开练习
    var exercise = 'https://mooc1.chaoxing.com/knowledge/cards' +
        '?clazzid=' + classId +
        '&courseid=' + courseId +
        '&knowledgeid=' + knowledgeId +
        '&num=1' +
        '&ut=s' +
        '&cpi=' + curCpi +
        '&v=20160407-1';
    // 章节测试
    var exam = 'https://mooc1.chaoxing.com/knowledge/cards' +
        '?clazzid=' + classId +
        '&courseid=' + courseId +
        '&knowledgeid=' + knowledgeId +
        '&num=2' +
        '&ut=s' +
        '&cpi=' + curCpi +
        '&v=20160407-1';
    return {
        video: video,
        exercise: exercise,
        exam: exam
    }
}

// 1 秒构造一次
var urlList = [];
setInterval(function() {
    if (myCourse.length != 0 && urlList.length == 0) {
        for (var i = 0; i < myCourse.length; i++)
            urlList.push(eval(myCourse[i]));
    }
}, 1000);

// 根据 URL 列表创建表单
function createList(htmlObj) {
    // 用户选择看片还是做题
    var typeForm = document.createElement('select');
    typeForm.setAttribute('id', 'type');
    typeForm.setAttribute('style', 'margin:5px;padding:15px;');
    // 创建选单内联 HTML
    typeForm.innerHTML = '<option value="video" selected>看片</option>' +
        '<option value="exercise">课后作业</option>' +
        '<option value="exam">章节测试</option>';
    // 套用表单到页面
    htmlObj.appendChild(typeForm);
    // 用户选择哪一课
    var courseForm = document.createElement('select');
    courseForm.setAttribute('id', 'course');
    courseForm.setAttribute('style', 'margin:5px;padding:15px;');
    // 创建选单内联 HTML
    var courseAvaliable = '';
    for (var i = 0; i < myCourse.length; i++) {
        var count = i + 1;
        courseAvaliable += '<option value="' + myCourse[i] + '">第 ' + count + ' 课</option>';
    }
    courseForm.innerHTML = courseAvaliable;
    // 套用表单到页面
    htmlObj.appendChild(courseForm);
    // 创建 <script> 标签，内联 creatFrame 函数
    var pageHead = document.getElementsByTagName('head')[0];
    var extScript = document.createElement('script');
    extScript.type = 'text/javascript';
    extScript.innerText = 'window.alert=function(){return!1};function creatFrame(){function genUrl(a,b,c){var d,e=document.getElementById("curCpi").attributes.value.value;d="video"==typeValue?"https://mooc1.chaoxing.com/knowledge/cards?clazzid="+b+"&courseid="+a+"&knowledgeid="+c+"&num=0&ut=s&cpi="+e+"&v=20160407-1":"exercise"==typeValue?"https://mooc1.chaoxing.com/knowledge/cards?clazzid="+b+"&courseid="+a+"&knowledgeid="+c+"&num=1&ut=s&cpi="+e+"&v=20160407-1":"https://mooc1.chaoxing.com/knowledge/cards?clazzid="+b+"&courseid="+a+"&knowledgeid="+c+"&num=2&ut=s&cpi="+e+"&v=20160407-1",console.log(d);var f=document.getElementsByClassName("Fuck")[0],g=document.getElementById("player");g||(g=document.createElement("div"),g.setAttribute("id","player"),f.appendChild(g));var h=document.getElementById("iframe");return h||(h=document.createElement("iframe")),h.setAttribute("id","iframe"),h.setAttribute("allowfullscreen","true"),h.setAttribute("webkitallowfullscreen","true"),h.setAttribute("mozallowfullscreen","true"),h.setAttribute("onload","clickImg()"),h.setAttribute("height","763"),h.setAttribute("frameborder","0"),h.setAttribute("src",d),f=document.getElementById("player"),void f.appendChild(h)}var type=document.getElementById("type"),typeIndex=type.selectedIndex,typeValue=type.options[typeIndex].value,course=document.getElementById("course"),courseIndex=course.selectedIndex,courseValue=course.options[courseIndex].value;eval(courseValue)}';
    /* 
     * 未压缩 JS 代码
     * 
    // 禁止一切弹窗
    window.alert = function() {
        return false;
    }
    // 根据用户选择创建 iframe
    function creatFrame() {
        function genUrl(courseId, classId, knowledgeId) {
            // 获取页面资讯
            var curCpi = document.getElementById('curCpi').attributes.value.value, url;
            // num：练习是 1, 影片是 0
            if (typeValue == 'video') {
                url = 'https://mooc1.chaoxing.com/knowledge/cards' +
                    '?clazzid=' + classId +
                    '&courseid=' + courseId +
                    '&knowledgeid=' + knowledgeId +
                    '&num=0' +
                    '&ut=s' +
                    '&cpi=' + curCpi +
                    '&v=20160407-1';
            } else if (typeValue == 'exercise') {
                url = 'https://mooc1.chaoxing.com/knowledge/cards' +
                    '?clazzid=' + classId +
                    '&courseid=' + courseId +
                    '&knowledgeid=' + knowledgeId +
                    '&num=1' +
                    '&ut=s' +
                    '&cpi=' + curCpi +
                    '&v=20160407-1';
            } else {
                url = 'https://mooc1.chaoxing.com/knowledge/cards' +
                    '?clazzid=' + classId +
                    '&courseid=' + courseId +
                    '&knowledgeid=' + knowledgeId +
                    '&num=2' +
                    '&ut=s' +
                    '&cpi=' + curCpi +
                    '&v=20160407-1';
            }
            console.log(url);
            // 新建一个 div
            var htmlObj = document.getElementsByClassName('Fuck')[0];
            // 避免大量新建 div，先做判断
            var playerDiv = document.getElementById('player');
            if (!playerDiv) {
                playerDiv = document.createElement('div');
                playerDiv.setAttribute('id', 'player');
                htmlObj.appendChild(playerDiv);
            }
            // 寻找 iframe，如果没有就创建一个
            var courseFrame = document.getElementById('iframe');
            if (!courseFrame) {
                courseFrame = document.createElement('iframe');
            }
            // 设置基本属性
            courseFrame.setAttribute('id', 'iframe');
            //courseFrame.setAttribute('scrolling', 'no');
            courseFrame.setAttribute('allowfullscreen', 'true');
            courseFrame.setAttribute('webkitallowfullscreen', 'true');
            courseFrame.setAttribute('mozallowfullscreen', 'true');
            courseFrame.setAttribute('onload', 'clickImg()');
            courseFrame.setAttribute('height', '763');
            courseFrame.setAttribute('frameborder', '0');
            courseFrame.setAttribute('src', url);
            // 套用 iframe 到页面
            htmlObj = document.getElementById('player');
            htmlObj.appendChild(courseFrame);
            return;
        }
        // 用户选择看片还是做题
        var type = document.getElementById('type'),
            typeIndex = type.selectedIndex,
            typeValue = type.options[typeIndex].value;
        // 用户选择哪一课
        var course = document.getElementById('course'),
            courseIndex = course.selectedIndex,
            courseValue = course.options[courseIndex].value;
        // 用 eval 调用 genUrl，创建 iframe
        eval(courseValue);
    }
    */
    pageHead.appendChild(extScript);
    // 创建提交按钮，并关联 creatFrame 函数
    var submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('class', 'cx-btn');
    submitButton.setAttribute('style', 'outline: currentcolor none medium; border: 0px none; background: rgb(63, 174, 147) none repeat scroll 0% 0%; color: rgb(255, 255, 255); border-radius: 4px; padding: 6px 9px; cursor: pointer; font-size: 12px; margin-left: 8px;');
    submitButton.setAttribute('onclick', 'creatFrame()');
    submitButton.innerText = '送出查询';
    htmlObj.appendChild(submitButton);
}

// 透过名为 Fuck 的 class 来动态添加新元素
setInterval(function() {
    // 获取目标容器并补上样式
    var htmlObj = document.getElementsByClassName('Fuck')[0],
        newObj = document.getElementById('title');
    if (htmlObj && !newObj && myCourse.length != 0 && urlList.length != 0) {
        // 给主页面固定好样式
        htmlObj.setAttribute('style', 'margin-top:10px;');
        // 创建标题并设定好样式
        var myTitle = document.createElement('p');
        myTitle.setAttribute('id', 'title');
        myTitle.setAttribute('style', 'font-size:20px;margin:10px;padding:15px;');
        // 套用标题到页面
        myTitle.innerHTML = '人脸认证已绕过<br>请在下方选择课程';
        htmlObj.appendChild(myTitle);
        // 创建 <script> 标签，将所有 URL 写入页面
        var pageHead = document.getElementsByTagName('head')[0];
        var urlVar = document.createElement('script');
        urlVar.type = 'text/javascript';
        urlVar.innerText = 'var urlList=' + JSON.stringify(urlList) + ';';
        // 套用到页面
        pageHead.appendChild(urlVar);
        // 创建下拉菜单和点击事件
        createList(htmlObj);
        // 实时检测题目并完成
        //setInterval(autoFill(), 1000);
    }
}, 1000);

// 自动刷课
function autoView() {
    var videoFrame = document.getElementById('iframe'),
        currentCourse = document.getElementById('course');
    if (videoFrame && currentCourse) {
        currentCourse = currentCourse.selectedIndex;
        if (videoFrame.contentDocument.getElementsByClassName('wrap')[0]) {
            var textLength = videoFrame.contentDocument.getElementsByClassName('wrap')[0].innerText.length,
                isDone = videoFrame.contentDocument.getElementsByClassName('ans-attach-ct ans-job-finished')[0],
                courseLength = document.getElementById('course').length;
            if (textLength > 20 || isDone) {
                if (currentCourse < courseLength) {
                    document.getElementById('course').selectedIndex = currentCourse + 1;
                    document.getElementsByClassName('cx-btn')[0].click();
                } else {
                    console.log("刷课完成！");
                }
            }
        }
    } else {
        if (document.getElementsByClassName('cx-btn')[0])
            document.getElementsByClassName('cx-btn')[0].click();
    }
    return autoView;
}

setInterval(autoView(), 500);

// 自动滚屏
function autoScroll() {
    var videoFrame = document.getElementById('iframe');
    if (videoFrame) {
        var lastTask = videoFrame.contentDocument.querySelector('div[class="ans-attach-ct"]');
        if (lastTask) {
            lastTask = lastTask.offsetTop;
            window.scrollTo({
                behavior: 'smooth',
                top: lastTask
            });
        }
    }
    return autoScroll;
}

setInterval(autoScroll(), 1000 * 3);
