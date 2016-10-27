/*!
 * WeUI.js v0.3.0 (https://github.com/progrape/weui.js)
 * Copyright 2016
 * Licensed under the MIT license
 */
'use strict';

(function ($) {
    $.weui = {
        version: '0.3.0'
    };

    $.noop = $.noop || function () {};
})($);
'use strict';

(function ($) {

    var $dialog = null;

    /**
     *  weui dialog
     * @param {Object} [options]
     */
    $.weui.dialog = function (options) {
        options = $.extend({
            title: '标题',
            content: '内容',
            className: '',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: $.noop
            }]
        }, options);

        var buttons = options.buttons.map(function (button) {
            return '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_' + button.type + '">' + button.label + '</a>';
        }).join('\n');
        var html = '<div class="' + options.className + '">\n                <div class="weui-mask"></div>\n                <div class="weui-dialog">\n                    <div class="weui-dialog__hd">\n                        <strong class="weui-dialog__title">\n                            ' + options.title + '\n                        </strong>\n                    </div>\n                    <div class="weui-dialog__bd">\n                        ' + options.content + '\n                    </div>\n                    <div class="weui-dialog__ft">\n                        ' + buttons + '\n                    </div>\n                </div>\n            </div>';
        $dialog = $(html);
        $('body').append($dialog);
        $dialog.on('click', '.weui-dialog__btn', function () {
            var button = options.buttons[$(this).index()];
            var cb = button.onClick || $.noop;
            cb.call();
            $.weui.closeDialog();
        });
    };

    /**
     * close dialog
     */
    $.weui.closeDialog = function () {
        if ($dialog) {
            $dialog.off('click');
            // zepto 核心不包含动画相关的方法
            if (typeof $dialog.fadeOut === 'function') {
                $dialog.fadeOut('fast', function () {
                    $dialog.remove();
                    $dialog = null;
                });
            } else {
                $dialog.remove();
                $dialog = null;
            }
        }
    };
})($);
'use strict';

(function ($) {
    /**
     * alert
     * @param {String} content
     * @param {Object} options
     * @param {Function} yes
     */
    $.weui.alert = function (content, options, yes) {

        var type = typeof options === 'function';
        if (type) {
            yes = options;
        }

        options = $.extend({
            title: '警告',
            content: content || '警告内容',
            className: '',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: yes
            }]
        }, type ? {} : options);
        options.className = 'weui-dialog_alert ' + options.className;

        $.weui.dialog(options);
    };
})($);
'use strict';

(function ($) {

    var $topTips = null;
    var timer = null;

    /**
     * show top tips
     * @param {String} content
     * @param {Object|Number|Function} [options]
     */
    $.weui.topTips = function () {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'topTips';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


        if ($topTips) {
            $topTips.remove();
            timer && clearTimeout(timer);
            $topTips = null;
        }

        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }

        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        options = $.extend({
            duration: 3000,
            callback: $.noop
        }, options);
        var html = '<div class="weui-toptips weui-toptips_warn">' + content + '</div>';
        $topTips = $(html);
        $topTips.appendTo($('body'));
        if (typeof $topTips.slideDown === 'function') {
            $topTips.slideDown(20);
        } else {
            $topTips.show();
        }

        timer = setTimeout(function () {
            if ($topTips) {
                if (typeof $topTips.slideUp === 'function') {
                    $topTips.slideUp(120, function () {
                        $topTips.remove();
                        $topTips = null;
                        options.callback();
                    });
                } else {
                    $topTips.remove();
                    $topTips = null;
                    options.callback();
                }
            }
        }, options.duration);
    };
})($);
'use strict';

(function ($) {

    var $actionSheetWrapper = null;

    /**
     * show actionSheet
     * @param {Array} menus
     * @param {Array} actions
     */
    $.weui.actionSheet = function () {
        var menus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [{ label: '取消' }];

        var cells = menus.map(function (item, idx) {
            return '<div class="weui-actionsheet__cell">' + item.label + '</div>';
        }).join('');
        var action = actions.map(function (item, idx) {
            return '<div class="weui-actionsheet__cell">' + item.label + '</div>';
        }).join('');
        var html = '<div>\n            <div class="weui-mask"></div>\n            <div class="weui-actionsheet">\n                <div class="weui-actionsheet__menu">\n                    ' + cells + '\n                </div>\n                <div class="weui-actionsheet__action">\n                    ' + action + '\n                </div>\n            </div>\n        </div>';

        $actionSheetWrapper = $(html);
        $('body').append($actionSheetWrapper);

        // add class
        $actionSheetWrapper.find('.weui-mask').show();
        $actionSheetWrapper.find('.weui-actionsheet').addClass('weui-actionsheet_toggle');

        // bind event
        $actionSheetWrapper.on('click', '.weui-actionsheet__menu .weui-actionsheet__cell', function () {
            var item = menus[$(this).index()];
            var cb = item.onClick || $.noop;
            cb.call();
            $.weui.hideActionSheet();
        }).on('click', '.weui-mask', function () {
            $.weui.hideActionSheet();
        }).on('click', '.weui-actionsheet__action .weui-actionsheet__cell', function () {
            var item = actions[$(this).index()];
            var cb = item.onClick || $.noop;
            cb.call();
            $.weui.hideActionSheet();
        });
    };

    $.weui.hideActionSheet = function () {
        if (!$actionSheetWrapper) {
            return;
        }

        var $mask = $actionSheetWrapper.find('.weui-mask');
        var $actionsheet = $actionSheetWrapper.find('.weui-actionsheet');

        $mask.hide();
        $actionsheet.removeClass('weui-actionsheet_toggle');

        $actionsheet.on('transitionend webkitTransitionEnd', function () {
            $actionSheetWrapper.remove();
            $actionSheetWrapper = null;
        });
    };
})($);
'use strict';

(function ($) {
    /**
     * confirm
     * @param {String} content
     * @param {String} options
     * @param {Function} yes
     * @param {Function} no
     */
    $.weui.confirm = function (content, options, yes, no) {

        var type = typeof options === 'function';
        if (type) {
            no = yes;
            yes = options;
        }

        options = $.extend({
            title: '确认',
            content: content || '确认内容',
            className: '',
            buttons: [{
                label: '不接受',
                type: 'default',
                onClick: no || $.noop
            }, {
                label: '接受',
                type: 'primary',
                onClick: yes || $.noop
            }]
        }, type ? {} : options);
        options.className = 'weui-dialog_confirm ' + options.className;

        $.weui.dialog(options);
    };
})($);
"use strict";

/**
 * Created by bearyan on 2016/2/16.
 */
(function () {
    function _validate($input) {
        var input = $input[0],
            val = $input.val();

        if (input.tagName == "INPUT" || input.tagName == "TEXTAREA") {
            var reg = input.getAttribute("required") || input.getAttribute("pattern") || "";

            if (!$input.val().length) {
                return "empty";
            } else if (reg) {
                return new RegExp(reg).test(val) ? null : "notMatch";
            } else {
                return null;
            }
        } else if (input.getAttribute("type") == "checkbox" || input.getAttribute("type") == "radio") {
            // 没有正则表达式：checkbox/radio要checked
            return input.checked ? null : "empty";
        } else if (val.length) {
            // 有输入值
            return null;
        }

        return "empty";
    }
    function _showErrorMsg(error) {
        if (error) {
            var $dom = error.$dom,
                msg = error.msg,
                tips = $dom.attr(msg + "Tips") || $dom.attr("tips") || $dom.attr("placeholder");
            if (tips) $.weui.topTips(tips);
            $dom.parents(".weui-cell").addClass("weui-cell_warn");
        }
    }

    var oldFnForm = $.fn.form;
    $.fn.form = function () {
        return this.each(function (index, ele) {
            var $form = $(ele);
            $form.find("[required]").on("blur", function () {
                var $this = $(this),
                    errorMsg;
                if ($this.val().length < 1) return; // 当空的时候不校验，以防不断弹出toptips

                errorMsg = _validate($this);
                if (errorMsg) {
                    _showErrorMsg({
                        $dom: $this,
                        msg: errorMsg
                    });
                }
            }).on("focus", function () {
                var $this = $(this);
                $this.parents(".weui-cell").removeClass("weui-cell_warn");
            });
        });
    };
    $.fn.form.noConflict = function () {
        return oldFnForm;
    };

    var oldFnValidate = $.fn.validate;
    $.fn.validate = function (callback) {
        return this.each(function () {
            var $requireds = $(this).find("[required]");
            if (typeof callback != "function") callback = _showErrorMsg;

            for (var i = 0, len = $requireds.length; i < len; ++i) {
                var $dom = $requireds.eq(i),
                    errorMsg = _validate($dom),
                    error = { $dom: $dom, msg: errorMsg };
                if (errorMsg) {
                    if (!callback(error)) _showErrorMsg(error);
                    return;
                }
            }
            callback(null);
        });
    };
    $.fn.validate.noConflict = function () {
        return oldFnValidate;
    };
})();
'use strict';

(function ($) {
    var $loading = null;

    /**
     * show loading
     * @param {String} content
     */
    $.weui.loading = function () {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'loading...';

        if ($loading) {
            return;
        }

        var html = '\n            <div class="weui-loading_toast">\n                <div class="weui-mask_transparent"></div>\n                <div class="weui-toast">\n                    <i class="weui-loading weui-icon_toast"></i>\n                    <p class="weui-toast__content">' + content + '</p>\n                </div>\n            </div>\n        ';
        $loading = $(html);
        $('body').append($loading);
    };

    /**
     * hide loading
     */
    $.weui.hideLoading = function () {
        $loading && $loading.remove();
        $loading = null;
    };
})($);
'use strict';

(function ($) {
    $.fn.progress = function (options) {
        var _this = this;

        options = $.extend({
            value: 0
        }, options);
        if (options.value < 0) {
            options.value = 0;
        }

        if (options.value > 100) {
            options.value = 100;
        }

        var $progress = this.find('.weui-progress__inner-bar');
        if ($progress.length === 0) {
            var opr = typeof options.onClick === 'function' ? '<a href="javascript:;" class="weui-progress__opr">\n                    <i class="weui-icon-cancel"></i>\n                </a>' : '';
            var html = '<div class="weui-progress">\n                <div class="weui-progress__bar">\n                    <div class="weui-progress__inner-bar" style="width: ' + options.value + '%;"></div>\n                </div>\n                ' + opr + '\n            </div>';
            if (typeof options.onClick === 'function') {
                this.on('click', '.weui-progress__opr', function () {
                    options.onClick.call(_this);
                });
            }
            return this.html(html);
        }

        //return $progress.animate({
        //    width: `${options.value}%`
        //}, 100);
        return $progress.width(options.value + '%');
    };
})($);
"use strict";

(function ($) {
    $.fn.searchBar = function (options) {
        options = $.extend({
            focusingClass: 'weui-search-bar_focusing',
            searchText: "搜索",
            cancelText: "取消"
        }, options);

        var html = "<div class=\"weui-search-bar\">\n                    <form class=\"weui-search-bar__form\">\n                        <div class=\"weui-search-bar__box\">\n                            <i class=\"weui-icon-search\"></i>\n                            <input type=\"search\" class=\"weui-search-bar__input\" id=\"weui-search-bar__input\" placeholder=\"" + options.searchText + "\" required/>\n                            <a href=\"javascript:\" class=\"weui-icon-clear\"></a>\n                        </div>\n                        <label for=\"weui-search-bar__input\" class=\"weui-search-bar__label\">\n                            <i class=\"weui-icon-search\"></i>\n                            <span>" + options.searchText + "</span>\n                        </label>\n                    </form>\n                    <a href=\"javascript:\" class=\"weui-search-bar__cancel-btn\">" + options.cancelText + "</a>\n                </div>";

        var $search = $(html);
        this.append($search);

        var $searchBar = this.find('.weui-search-bar');
        var $searchText = this.find('.weui-search-bar__label');
        var $searchInput = this.find('.weui-search-bar__input');

        this.on('focus', '#weui-search-bar__input', function () {
            $searchText.hide();
            $searchBar.addClass(options.focusingClass);
            bindEvent($searchInput, 'onfocus', options);
        }).on('blur', '#weui-search-bar__input', function () {
            $searchBar.removeClass(options.focusingClass);
            !!$(this).val() ? $searchText.hide() : $searchText.show();
            bindEvent($searchInput, 'onblur', options);
        }).on('touchend', '.weui-search-bar__cancel-btn', function () {
            $searchInput.val('');
            bindEvent($searchInput, 'oncancel', options);
        }).on('touchend', '.weui-icon-clear', function (e) {
            //阻止默认动作
            e.preventDefault();
            $searchInput.val('');
            if (document.activeElement.id != 'weui-search-bar__input') {
                $searchInput.trigger('focus');
            }
            bindEvent($searchInput, 'onclear', options);
        }).on('input', '.weui-search-bar__input', function () {
            bindEvent($searchInput, 'input', options);
        }).on('submit', '.weui-search-bar__form', function () {
            if (typeof options.onsubmit == 'function') {
                bindEvent($searchInput, 'onsubmit', options);
                return false;
            }
        });

        function bindEvent(target, event, options) {
            if (typeof options[event] == 'function') {
                var value = $(target).val();
                options[event].call(target, value);
            }
        }
    };
})($);
'use strict';

(function ($) {
    var oldFnTab = $.fn.tab;
    $.fn.tab = function (options) {
        options = $.extend({
            defaultIndex: 0,
            activeClass: 'weui-bar__item_on',
            onToggle: $.noop
        }, options);
        var $tabbarItems = this.find('.weui-tabbar__item, .weui-navbar__item');
        var $tabBdItems = this.find('.weui-tab__panel');

        this.toggle = function (index) {
            var $defaultTabbarItem = $tabbarItems.eq(index);
            $defaultTabbarItem.addClass(options.activeClass).siblings().removeClass(options.activeClass);

            var $defaultTabBdItem = $tabBdItems.eq(index);
            $defaultTabBdItem.show().siblings().hide();

            options.onToggle(index);
        };
        var self = this;

        this.on('click', '.weui-tabbar__item, .weui-navbar__item', function (e) {
            var index = $(this).index();
            self.toggle(index);
        });

        this.toggle(options.defaultIndex);

        return this;
    };
    $.fn.tab.noConflict = function () {
        return oldFnTab;
    };
})($);
'use strict';

(function ($) {

    /**
     * show toast
     * @param {String} content
     * @param {Object|Number} [options]
     */
    $.weui.toast = function () {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'toast';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }

        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        options = $.extend({
            duration: 3000,
            callback: $.noop
        }, options);

        var html = '<div>\n            <div class="weui-mask_transparent"></div>\n            <div class="weui-toast">\n                <i class="weui-icon_toast weui-icon-success-no-circle"></i>\n                <p class="weui-toast__content">' + content + '</p>\n            </div>\n        </div>';
        var $toast = $(html);
        $('body').append($toast);

        setTimeout(function () {
            $toast.remove();
            $toast = null;
            options.callback();
        }, options.duration);
    };
})($);
'use strict';

(function ($) {
    var oldFnUploader = $.fn.uploader;

    $.fn.uploader = function (options) {
        var _this = this;

        options = $.extend({
            title: '图片上传',
            maxCount: 4,
            compress: true,
            maxWidth: 500,
            auto: true,
            field: 'file',
            url: '/upload.php',
            method: 'POST',
            accept: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
            headers: {},

            // event
            onChange: $.noop, // alias `onAddedFile`
            onAddedFile: $.noop,
            onRemovedfile: $.noop,
            onError: $.noop,
            onSuccess: $.noop,
            onComplete: $.noop

        }, options);

        var html = '<div class="weui-uploader">\n                        <div class="weui-uploader__hd">\n                            <div class="weui-uploader__title">' + options.title + '</div>\n                            <div class="weui-uploader__info">0/' + options.maxCount + '</div>\n                        </div>\n                        <div class="weui-uploader__bd">\n                            <ul class="weui-uploader__files">\n                            </ul>\n                            <div class="weui-uploader__input-box">\n                                <input class="weui-uploader__input" type="file" accept="' + options.accept.join(',') + '">\n                            </div>\n                        </div>\n                    </div>';
        this.html(html);

        var $uploader = this;
        var $files = this.find('.weui-uploader__files');
        var $file = this.find('.weui-uploader__input');
        var blobs = [];

        /**
         * dataURI to blob, ref to https://gist.github.com/fupslot/5015897
         * @param dataURI
         */
        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }

        /**
         * error
         */
        function error(index) {
            var $preview = $files.find('.weui-uploader__file').eq(index);
            $preview.addClass('weui-uploader__file_status');
            $preview.html('<div class="weui-uploader__file-content"><i class="weui-icon-warn"></i></div>');
        }

        /**
         * success
         */
        function success(index) {
            var $preview = $files.find('.weui-uploader__file_status').eq(index);
            $preview.removeClass('weui-uploader__file-content');
            $preview.html('');
        }

        /**
         * update
         * @param msg
         */
        function update(msg) {
            var $preview = $files.find('.weui-uploader__file').last();
            $preview.addClass('weui-uploader__file_status');
            $preview.html('<div class="weui-uploader__file-content">' + msg + '</div>');
        }

        /**
         * 上传
         */
        function upload(file, index) {
            var fd = new FormData();
            fd.append(options.field, file.blob, file.name);
            $.ajax({
                type: options.method,
                url: options.url,
                data: fd,
                processData: false,
                contentType: false
            }).success(function (res) {
                success(index);
                options.onSuccess(res);
            }).error(function (err) {
                error(index);
                options.onError(err);
            }).always(function () {
                options.onComplete();
            });
        }

        $file.on('change', function (event) {
            var files = event.target.files;

            if (files.length === 0) {
                return;
            }

            if (blobs.length >= options.maxCount) {
                return;
            }

            $.each(files, function (idx, file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.onload = function () {
                        // 不要超出最大宽度
                        var w = options.compress ? Math.min(options.maxWidth, img.width) : img.width;
                        // 高度按比例计算
                        var h = img.height * (w / img.width);
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        // 设置 canvas 的宽度和高度
                        canvas.width = w;
                        canvas.height = h;

                        var iphone = navigator.userAgent.match(/iPhone OS ([^\s]*)/);
                        if (iphone && iphone[1].substr(0, 1) == 7) {
                            if (img.width == 3264 && img.height == 2448) {
                                // IOS7的拍照或选照片会被莫名地压缩，所以画板要height要*2
                                ctx.drawImage(img, 0, 0, w, h * 2);
                            } else {
                                ctx.drawImage(img, 0, 0, w, h);
                            }
                        } else {
                            ctx.drawImage(img, 0, 0, w, h);
                        }

                        var dataURL = canvas.toDataURL();
                        var blob = dataURItoBlob(dataURL);
                        blobs.push({ name: file.name, blob: blob });
                        var blobUrl = URL.createObjectURL(blob);

                        $files.append('<li class="weui-uploader__file " style="background-image:url(' + blobUrl + ')"></li>');
                        $uploader.find('.weui-uploader__hd .weui-cell__ft').text(blobs.length + '/' + options.maxCount);

                        // trigger onAddedfile event
                        options.onAddedFile({
                            lastModified: file.lastModified,
                            lastModifiedDate: file.lastModifiedDate,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            data: dataURL, // rename to `dataURL`, data will be remove later
                            dataURL: dataURL
                        });

                        // 如果是自动上传
                        if (options.auto) {
                            upload({ name: file.name, blob: blob }, blobs.length - 1);
                        }

                        // 如果数量达到最大, 隐藏起选择文件按钮
                        if (blobs.length >= options.maxCount) {
                            $uploader.find('.weui-uploader__input-box').hide();
                        }
                    };

                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        });

        this.on('click', '.weui-uploader__file', function () {
            $.weui.confirm('确定删除该图片?', function () {
                var index = $(_this).index();
                _this.remove(index);
            });
        });

        /**
         * 主动调用上传
         */
        this.upload = function () {
            // 逐个上传
            blobs.map(upload);
        };

        /**
         * 删除第 ${index} 张图片
         * @param index
         */
        this.remove = function (index) {
            var $preview = $files.find('.weui-uploader__file').eq(index);
            $preview.remove();
            blobs.splice(index, 1);
            options.onRemovedfile(index);

            // 如果数量达到最大, 隐藏起选择文件按钮
            if (blobs.length < options.maxCount) {
                $uploader.find('.weui-uploader__input-box').show();
            }
        };

        return this;
    };
    $.fn.uploader.noConflict = function () {
        return oldFnUploader;
    };
})($);