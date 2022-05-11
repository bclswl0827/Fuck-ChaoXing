// ==UserScript==
// @name         去你妈的反调试
// @version      1.0.0
// @description  去你妈的反调试
// @include      *
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    // 停止清空控制台
    var interval = setInterval(function() {
        unsafeWindow.console.clear = () => {};
    }, 0); // 设置 0 不执行

    // 页面加载过后停用所有定时器
    window.onload = function() {
        clearInterval(interval);
    }

    var _constructor = unsafeWindow.Function.prototype.constructor;
    unsafeWindow.Function.prototype.constructor = function() { // Hook 住 Function.prototype.constructor
        var fnContent = arguments[0];
        if (fnContent) {
            // 存在反调试机制
            if (fnContent.includes('debugger')) {
                var theCaller = Function.prototype.constructor.caller;
                var callerContent = theCaller.toString();
                // 如果存在 debugger 语句
                if (callerContent.includes(/\bdebugger\b/gi)) {
                    // 用正则干掉所有 debugger 语句
                    callerContent = callerContent.replace(/\bdebugger\b/gi, '');
                    eval('caller = ' + callerContent); // 换掉 function
                }
                return (function() {});
            }
        }
        // 若无异常，则执行正常的构造函数
        return _constructor.apply(this, arguments);
    };
})();
