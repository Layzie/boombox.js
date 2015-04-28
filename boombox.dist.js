'use strict';

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Browser sound library which blended HTMLVideo and HTMLAudio and WebAudio
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 CyberAgent, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * @license MIT
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 */
(function (w) {
    'use strict';

    var none = function none() {};

    var isRequire = !!(typeof define === 'function' && define.amd);

    var SPRITE_SEPARATOR = '-';
    var LOGGER_DEFAULT_SEPARATOR = '-';

    var getSpriteName = function getSpriteName(name) {
        return {
            prefix: name.substring(0, name.indexOf(SPRITE_SEPARATOR)),
            suffix: name.substring(name.indexOf(SPRITE_SEPARATOR) + 1),
            name: name
        };
    };

    /**
     * trace: 1
     * debug: 2
     * info:  3
     * warn:  4
     * error: 5
     *
     */
    var LOG_LEVEL = 3; // default: info
    var slice = Array.prototype.slice;

    var Logger = (function () {
        function Logger(prefix) {
            _classCallCheck(this, Logger);

            this.prefix = prefix || LOGGER_DEFAULT_SEPARATOR;
            this.prefix = '[' + this.prefix + ']';
        }

        _createClass(Logger, [{
            key: 'trace',
            value: function trace() {
                /**
                 * Log output (trace)
                 * @memberof Logger
                 * @name trace
                 */
                if (LOG_LEVEL <= 1) {
                    if (!w.console) {} else if (w.console.trace) {
                        w.console.trace('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                    } else if (w.console.debug) {
                        w.console.debug('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                    } else {
                        w.console.log('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                    }
                }
            }
        }, {
            key: 'debug',
            value: function debug() {
                /**
                 * Log output (info)
                 * @memberof Logger
                 * @name debug
                 */
                if (LOG_LEVEL <= 2) {
                    if (!w.console) {} else if (w.console.debug) {
                        w.console.debug('[DEBUG]', this.prefix, slice.call(arguments).join(' '));
                    } else {
                        w.console.log('[DEBUG]', this.prefix, slice.call(arguments).join(' '));
                    }
                }
            }
        }, {
            key: 'info',
            value: function info() {
                /**
                 * Log output (info)
                 * @memberof Logger
                 * @name info
                 */
                if (LOG_LEVEL <= 3) {
                    w.console && w.console.info('[INFO]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        }, {
            key: 'warn',
            value: function warn() {
                /**
                 * Log output (warn)
                 * @memberof Logger
                 * @name warn
                 */
                if (LOG_LEVEL <= 4) {
                    w.console && w.console.warn('[WARN]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        }, {
            key: 'error',
            value: function error() {
                /**
                 * Log output (error)
                 * @memberof Logger
                 * @name error
                 */
                if (LOG_LEVEL <= 5) {
                    w.console && w.console.error('[ERROR]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        }]);

        return Logger;
    })();

    //////////////////////////////////
    // Boombox Class

    var Boombox = (function () {
        function Boombox() {
            _classCallCheck(this, Boombox);

            /**
             * Version
             * @memberof Boombox
             * @name VERSION
             */
            this.VERSION = '1.0.8';

            /**
             * Loop off
             *
             * @memberof Boombox
             * @name LOOP_NOT
             * @constant
             * @type {Interger}
             */
            this.LOOP_NOT = 0;

            /**
             * orignal loop
             *
             * @memberof Boombox
             * @name LOOP_ORIGINAL
             * @constant
             * @type {Interger}
             */
            this.LOOP_ORIGINAL = 1;

            /**
             * Native loop
             *
             * @memberof Boombox
             * @name LOOP_NATIVE
             * @constant
             * @type {Interger}
             */
            this.LOOP_NATIVE = 2;

            /**
             * Turn off the power.
             *
             * @memberof Boombox
             * @name POWER_OFF
             * @constant
             * @type {Boolean}
             */
            this.POWER_OFF = false;

            /**
             * Turn on the power.
             *
             * @memberof Boombox
             * @name POWER_ON
             * @constant
             * @type {Boolean}
             */
            this.POWER_ON = true;

            /**
             * It does not support the media type.
             *
             * @memberof Boombox
             * @name ERROR_MEDIA_TYPE
             * @constant
             * @type {Interger}
             */
            this.ERROR_MEDIA_TYPE = 0;

            /**
             * Hit the filter
             *
             * @memberof Boombox
             * @name ERROR_HIT_FILTER
             * @constant
             * @type {Interger}
             */
            this.ERROR_HIT_FILTER = 1;

            /**
             * Threshold to determine whether sound source is finished or not
             *
             * @memberof Boombox
             * @name THRESHOLD
             * @type {Interger}
             */
            this.THRESHOLD = 0.2;

            /**
             * flag setup
             * @memberof Boombox
             * @name setuped
             * @type {Boolean}
             */
            this.setuped = false;

            /**
             * AudioContext
             * @memberof Boombox
             * @name AudioContext
             * @type {AudioContext}
             */
            this.AudioContext = w.AudioContext || w.webkitAudioContext;

            /**
             * Environmental support information
             *
             * @memberof Boombox
             * @name support
             * @type {Object}
             */
            this.support = {
                mimes: [],
                webaudio: {
                    use: !!this.AudioContext
                },
                htmlaudio: {
                    use: false
                },
                htmlvideo: {
                    use: false
                }
            };

            if (this.support.webaudio.use) {
                /**
                 * WebAudioContext instance (singleton)
                 *
                 * @memberof Boombox
                 * @name WEB_AUDIO_CONTEXT
                 * @type {AudioContext}
                 */
                this.WEB_AUDIO_CONTEXT = new this.AudioContext();
                if (!this.WEB_AUDIO_CONTEXT.createGain) {
                    this.WEB_AUDIO_CONTEXT.createGain = this.WEB_AUDIO_CONTEXT.createGainNode;
                }
            }

            // Check HTML Audio support.
            try {
                /**
                 * Test local HTMLAudio
                 * @memberof Boombox
                 * @name _audio
                 * @type {HTMLAudioElement}
                 */
                this._audio = new w.Audio();
                if (this._audio.canPlayType) {
                    this.support.htmlaudio.use = true;
                } else {
                    this.support.htmlaudio.use = false;
                }
            } catch (e) {
                this.support.htmlaudio.use = false;
            }

            // Check HTML Video support.
            try {
                /**
                 * Test local HTMLVideo
                 * @memberof Boombox
                 * @name _video
                 * @type {HTMLVideoElement}
                 */
                this._video = document.createElement('video');
                if (this._video.canPlayType) {
                    this.support.htmlvideo.use = true;
                } else {
                    this.support.htmlvideo.use = false;
                }
            } catch (e) {
                this.support.htmlvideo.use = false;
            }

            /**
             * Audio instance pool
             *
             * @memberof Boombox
             * @name pool
             */
            this.pool = {};

            /**
             * Audio instance of waiting
             *
             * @memberof Boombox
             * @name waits
             */
            this.waits = [];

            /**
             * Visibility of browser
             *
             * @memberof Boombox
             * @name visibility
             */
            this.visibility = {
                hidden: undefined,
                visibilityChange: undefined
            };

            /**
             * State of boombox
             *
             * @memberof Boombox
             * @name state
             * @type {Object}
             */
            this.state = {
                power: this.POWER_ON
            };

            /**
             * Filtering function
             *
             * @memberof Boombox
             * @name filter
             * @type {Object}
             */
            this.filter = {};
        }

        _createClass(Boombox, [{
            key: 'isWebAudio',
            value: function isWebAudio() {
                /**
                 * The availability of the WebLAudio
                 *
                 * @memberof Boombox
                 * @name isWebAudio
                 * @return {Boolean}
                 */
                return this.support.webaudio.use;
            }
        }, {
            key: 'isHTMLAudio',
            value: function isHTMLAudio() {
                /**
                 * The availability of the HTMLAudio
                 *
                 * @memberof Boombox
                 * @name isHTMLAudio
                 * @return {Boolean}
                 */
                return this.support.htmlaudio.use;
            }
        }, {
            key: 'isHTMLVideo',
            value: function isHTMLVideo() {
                /**
                 * The availability of the HTMLVideo
                 *
                 * @memberof Boombox
                 * @name isHTMLVideo
                 * @return {Boolean}
                 */
                return this.support.htmlvideo.use;
            }
        }, {
            key: 'isPlayback',
            value: function isPlayback() {
                var res = false;

                for (var _name in this.pool) {
                    if (this.pool[_name].isPlayback()) {
                        res = true;
                        break;
                    }
                }

                return res;
            }
        }, {
            key: 'setup',
            value: function setup(options) {
                /**
                 * Setup processing
                 *
                 * @memberof Boombox
                 * @name setup
                 * @param {Object} options
                 * @return {Boombox}
                 * @example
                 * var options = {
                 *     webaudio: {use: Boolean},
                 *     htmlaudio: {use: Boolean},
                 *     htmlvideo: {use: Boolean},
                 *     loglevel: Number, ) trace:1, debug:2, info:3, warn:4, error:5
                 * }
                 *
                 */
                options = options || {};

                if (typeof options.threshold !== 'undefined') {
                    this.THRESHOLD = options.threshold;
                }

                if (typeof options.loglevel !== 'undefined') {
                    LOG_LEVEL = options.loglevel;
                }

                this.logger = new Logger('Boombox '); // log

                if (this.setuped) {
                    this.logger.warn('"setup" already, are running.');
                    return this;
                }

                if (options.webaudio) {
                    if (typeof options.webaudio.use !== 'undefined') {
                        this.support.webaudio.use = options.webaudio.use;
                        this.logger.info('options.webaudio.use:', this.support.webaudio.use);
                    }
                }

                if (options.htmlaudio) {
                    if (typeof options.htmlaudio.use !== 'undefined') {
                        this.support.htmlaudio.use = options.htmlaudio.use;
                        this.logger.info('options.htmlaudio.use: ', this.support.htmlaudio.use);
                    }
                }

                if (options.htmlvideo) {
                    if (typeof options.htmlvideo.use !== 'undefined') {
                        this.support.htmlvideo.use = options.htmlvideo.use;
                        this.logger.info('options htmlvideo', this.support.htmlvideo);
                    }
                }

                // scan browser
                this._browserControl();

                // Log: WebAudio support.
                if (this.support.webaudio.use) {
                    this.logger.debug('WebAudio use support.');
                } else {
                    this.logger.debug('WebAudio use not support.');
                }
                // Log: HTMLAudio support.
                if (this.support.htmlaudio.use) {
                    this.logger.debug('HTMLAudio use support.');
                } else {
                    this.logger.debug('HTMLAudio use not support.');
                }
                // Log: HTMLVideo support.
                if (this.support.htmlvideo.use) {
                    this.logger.debug('HTMLVideo use support.');
                } else {
                    this.logger.debug('HTMLVideo use not support.');
                }

                this.setuped = true;

                return this;
            }
        }, {
            key: 'get',
            value: function get(name) {
                /**
                 * Get Audio instance
                 *
                 * @memberof Boombox
                 * @name get
                 * @param {String} name audio name
                 * @return {WebAudio|HTMLAudio|HTMLVideo}
                 */
                return this.pool[name];
            }
        }, {
            key: 'load',
            value: function load(name, options, useHTMLVideo, callback) {
                /**
                 * Loading audio
                 *
                 * @memberof Boombox
                 * @name load
                 * @param {String} name audio name
                 * @param {Object} options Audio options
                 * @param {Boolean} useHTMLVideo forced use HTMLVideo
                 * @param {Function} callback
                 * @return {Boombox}
                 * @example
                 * var options = {
                 *     src: [
                 *         {
                 *             media: 'audio/mp4',
                 *             path: 'http://example.com/sample.m4a',
                 *         }
                 *     ]
                 *     filter: ['android2', 'android4', 'ios5', 'ios6', 'ios7' ]
                 * }
                 *
                 */
                if (typeof arguments[2] === 'function') {
                    callback = useHTMLVideo;
                    useHTMLVideo = null;
                }

                if (!this.setuped) {
                    callback && callback(new Error('setup incomplete boombox. run: boombox.setup(options)'));
                    return this;
                }

                if (this.pool[name]) {
                    this.logger.trace('audio pool cache hit!!', name);
                    return callback && callback(null, this.pool[name]);
                }

                // check support media type
                var src = this.useMediaType(options.src);
                if (src) {
                    options.media = src.media;
                    options.src = src.path;
                }

                // forced use HTMLVideo
                if (useHTMLVideo && this.isHTMLVideo()) {
                    var htmlvideo = new boombox.HTMLVideo(name);

                    if (!src) {
                        htmlvideo.state.error = this.ERROR_MEDIA_TYPE;
                    }

                    if (typeof htmlvideo.state.error === 'undefined' && !this.runfilter(htmlvideo, options)) {
                        htmlvideo.load(options, callback);
                    } else {
                        return callback && callback(new Error(htmlvideo.state.error), htmlvideo);
                    }

                    this.setPool(name, htmlvideo, boombox.HTMLVideo);

                    return this;
                }

                //////////////////////

                if (this.isWebAudio()) {
                    this.logger.debug('use web audio');
                    var webaudio = new boombox.WebAudio(name);

                    if (!src) {
                        webaudio.state.error = this.ERROR_MEDIA_TYPE;
                    }

                    if (typeof webaudio.state.error === 'undefined' && !this.runfilter(webaudio, options)) {
                        webaudio.load(options, callback);
                    } else {
                        return callback && callback(new Error(webaudio.state.error), webaudio);
                    }

                    this.setPool(name, webaudio, boombox.WebAudio);
                } else if (this.isHTMLAudio()) {
                    this.logger.debug('use html audio');
                    var htmlaudio = new boombox.HTMLAudio(name);
                    if (!src) {
                        htmlaudio.state.error = this.ERROR_MEDIA_TYPE;
                    }

                    if (typeof htmlaudio.state.error === 'undefined' && !this.runfilter(htmlaudio, options)) {
                        htmlaudio.load(options, callback);
                    } else {
                        return callback && callback(new Error(htmlaudio.state.error), htmlaudio);
                    }

                    this.setPool(name, htmlaudio, boombox.HTMLAudio);
                } else {
                    callback && callback(new Error('This environment does not support HTMLAudio, both WebAudio both.'), this);
                }

                return this;
            }
        }, {
            key: 'remove',
            value: function remove(name) {
                /**
                 * remove audio
                 *
                 * @memberof Boombox
                 * @name remove
                 * @param {String} name
                 * @return {Boombox}
                 */
                if (this.pool[name]) {
                    // change object
                    this.logger.trace('Remove Audio that is pooled. name', name);
                    this.pool[name].dispose && this.pool[name].dispose();
                    this.pool[name] = undefined;
                    delete this.pool[name];
                }
                return this;
            }
        }, {
            key: 'setPool',
            value: function setPool(name, obj, Obj) {
                /**
                 * Set pool
                 *
                 * @memberof Boombox
                 * @name setPool
                 * @param {String} name
                 * @param {AudioContext|HTMLAudioElement|HTMLVideoElement} obj Browser audio instance
                 * @param {WebAudio|HTMLAudio|HTMLVideo} Obj Boombox audio class
                 * @return {Boombox}
                 */
                if (obj.isParentSprite()) {
                    for (var r in this.pool) {
                        if (!! ~r.indexOf(name + SPRITE_SEPARATOR)) {
                            delete this.pool[r];
                        }
                    }

                    for (var n in obj.sprite.options) {
                        var cname = name + SPRITE_SEPARATOR + n;
                        var audio = new Obj(cname, obj);
                        this.pool[audio.name] = audio;
                    }
                }

                this.remove(name);
                this.pool[name] = obj;

                return this;
            }
        }, {
            key: 'runfilter',
            value: function runfilter(audio, options) {
                /**
                 * Run filter
                 *
                 * @memberof Boombox
                 * @name runfilter
                 * @param {WebAudio|HTMLAudio|HTMLVideo} audio Boombox audio instance
                 * @param {Object} options
                 * @return {Boolean}
                 */
                var hit;

                var list = options.filter || [];

                for (var i = 0; i < list.length; i++) {
                    var _name2 = list[i];

                    var fn = this.filter[_name2];
                    if (!fn) {
                        this.logger.warn('filter not found. name:', _name2);
                        return;
                    }
                    this.logger.debug('filter run. name:', _name2);

                    if (fn(_name2, audio, options)) {
                        hit = _name2;
                        break;
                    }
                }

                if (hit) {
                    audio.state.error = this.ERROR_HIT_FILTER; // set error
                    this.logger.warn('Hit the filter of', hit);
                    return true;
                }

                return false;
            }
        }, {
            key: 'useMediaType',
            value: function useMediaType(src) {
                /**
                 * check support media type
                 *
                 * @memberof Boombox
                 * @name useMediaType
                 * @param {Array} src audio file data
                 * @return {Object|undefined}
                 */
                for (var i = 0; i < src.length; i++) {
                    var t = src[i];
                    if (this._audio.canPlayType(t.media)) {
                        return t;
                    } else {
                        this.logger.warn('skip audio type.', t.media);
                    }
                }

                return undefined;
            }
        }, {
            key: 'pause',
            value: function pause() {
                /**
                 * pause sound playback in managing boombox
                 *
                 * @memberof Boombox
                 * @name pause
                 * @return {boombox}
                 */
                var self = this;
                this.logger.trace('pause');

                for (var _name3 in this.pool) {
                    var audio = this.pool[_name3];
                    audio.pause();
                    self.waits.push(_name3);
                }

                return this;
            }
        }, {
            key: 'resume',
            value: function resume() {
                /**
                 * resume the paused, to manage the boombox
                 *
                 * @memberof Boombox
                 * @name resume
                 * @return {Boombox}
                 */
                this.logger.trace('resume');
                var name = this.waits.shift();
                if (name && this.pool[name]) {
                    this.pool[name].resume();
                }
                if (0 < this.waits.length) {
                    this.resume();
                }
                return this;
            }
        }, {
            key: 'power',
            value: function power(p) {
                /**
                 * Change all audio power on/off
                 *
                 * @memberof Boombox
                 * @name power
                 * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
                 * @return {Boombox}
                 */
                var self = this;
                this.logger.trace('power:', this.name, 'flag:', p);

                for (var _name4 in this.pool) {
                    var audio = this.pool[_name4];
                    audio.power(p);
                }

                this.state.power = p;
                return this;
            }
        }, {
            key: 'volume',
            value: function volume(v) {
                /**
                 * audio change volume.
                 *
                 * @memberof Boombox
                 * @method
                 * @name volume
                 * @param {Interger} v volume
                 * @return {Boombox}
                 */
                var self = this;
                this.logger.trace('volume:', this.name, 'volume:', v);

                for (var _name5 in this.pool) {
                    var audio = this.pool[_name5];
                    audio.volume(v);
                }

                return this;
            }
        }, {
            key: 'onVisibilityChange',
            value: function onVisibilityChange(e) {
                /**
                 * Firing in the occurrence of events VisibilityChange
                 *
                 * @memberof Boombox
                 * @name onVisibilityChange
                 * @param {Event} e event
                 */
                this.logger.trace('onVisibilityChange');
                if (document[this.visibility.hidden]) {
                    this.pause();
                } else {
                    this.resume();
                }
            }
        }, {
            key: 'onFocus',
            value: function onFocus(e) {
                /**
                 * Firing in the occurrence of events window.onfocus
                 *
                 * @memberof Boombox
                 * @name onFocus
                 * @param {Event} e event
                 */
                this.logger.trace('onFocus');
                this.resume();
            }
        }, {
            key: 'onBlur',
            value: function onBlur(e) {
                /**
                 * Firing in the occurrence of events window.onblur
                 *
                 * @memberof Boombox
                 * @name onBlur
                 * @param {Event} e event
                 */
                this.logger.trace('onBlur');
                this.pause();
            }
        }, {
            key: 'onPageShow',
            value: function onPageShow(e) {
                /**
                 * Firing in the occurrence of events window.onpageshow
                 *
                 * @memberof Boombox
                 * @name onPageShow
                 * @param {Event} e event
                 */
                this.logger.trace('onPageShow');
                this.resume();
            }
        }, {
            key: 'onPageHide',
            value: function onPageHide(e) {
                /**
                 * Firing in the occurrence of events window.onpagehide
                 *
                 * @memberof Boombox
                 * @name onPageHide
                 * @param {Event} e event
                 */
                this.logger.trace('onPageHide');
                this.pause();
            }
        }, {
            key: '_browserControl',
            value: function _browserControl() {
                var _this = this;

                /**
                 * Scan browser differences
                 *
                 * @memberof Boombox
                 * @name _browserControl
                 * @return {Boombox}
                 */
                if (typeof document.hidden !== 'undefined') {
                    this.visibility.hidden = 'hidden';
                    this.visibility.visibilityChange = 'visibilitychange';
                } else if (typeof document.webkitHidden !== 'undefined') {
                    this.visibility.hidden = 'webkitHidden';
                    this.visibility.visibilityChange = 'webkitvisibilitychange';
                } else if (typeof document.mozHidden !== 'undefined') {
                    this.visibility.hidden = 'mozHidden';
                    this.visibility.visibilityChange = 'mozvisibilitychange';
                } else if (typeof document.msHidden !== 'undefined') {
                    this.visibility.hidden = 'msHidden';
                    this.visibility.visibilityChange = 'msvisibilitychange';
                }
                // Visibility.hidden
                if (this.visibility.hidden) {
                    document.addEventListener(this.visibility.visibilityChange, function (e) {
                        _this.onVisibilityChange(e);
                    }, false);
                }

                // focus/blur
                if (typeof window.addEventListener !== 'undefined') {
                    window.addEventListener('focus', function (e) {
                        _this.onFocus(e);
                    }, false);
                    window.addEventListener('blur', function (e) {
                        _this.onBlur(e);
                    }, false);
                } else {
                    window.attachEvent('onfocusin', function (e) {
                        _this.onFocus(e);
                    }, false);
                    window.attachEvent('onfocusout', function (e) {
                        _this.onBlur(e);
                    }, false);
                }

                // onpage show/hide
                window.onpageshow = function (e) {
                    _this.onPageShow(e);
                };

                window.onpagehide = function (e) {
                    _this.onPageHide(e);
                };

                //
                return this;
            }
        }, {
            key: 'addFilter',
            value: function addFilter(name, fn) {
                /**
                 * Adding filtering
                 *
                 * @memberof Boombox
                 * @name addFilter
                 * @param {String} filter name
                 * @param {Function} filter function
                 * @return {Boombox}
                 */
                this.filter[name] = fn;
                return this;
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                /**
                 * dispose
                 *
                 * @memberof Boombox
                 * @name dispose
                 */
                for (var _name6 in this.pool) {
                    var audio = this.pool[_name6];
                    audio.dispose && audio.dispose();
                }

                delete this.VERSION;
                delete this.setuped;
                delete this.support.mimes;
                delete this.support.webaudio.use;
                this.WEB_AUDIO_CONTEXT && delete this.WEB_AUDIO_CONTEXT;

                delete this.support.webaudio;
                delete this.support.htmlaudio.use;
                delete this.support.htmlaudio;
                delete this.support.htmlvideo.use;
                delete this.support.htmlvideo;
                delete this.support;

                delete this.pool;

                delete this.waits;
                delete this.visibility;
                delete this.state.power;
                delete this.state;
                delete this._audio;
                delete this._video;
                delete this.filter;
            }
        }]);

        return Boombox;
    })();

    //////////////////////////////////
    // New!!!!
    var boombox = new Boombox();

    //////////////////////////////////
    // HTMLAudio Class

    var HTMLAudio = (function () {
        function HTMLAudio(name, parent) {
            _classCallCheck(this, HTMLAudio);

            /**
             * logger
             * @memberof HTMLAudio
             * @name logger
             */
            this.logger = new Logger('HTMLAudio');

            /**
             * unique name
             * @memberof HTMLAudio
             * @name name
             */
            this.name = name;

            /**
             * SetTimeout#id pool running
             * @memberof HTMLAudio
             * @name _timer
             */
            this._timer = {}; // setTimeout#id

            /**
             * AudioSprite option data
             * @memberof HTMLAudio
             * @name sprite
             */
            this.sprite = undefined;
            if (parent) {
                var sprite_n = getSpriteName(name);

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];

                /**
                 * Reference of the parent instance HTMLAudio
                 * @memberof HTMLAudio
                 * @name parent
                 */
                this.parent = parent; // ref

                /**
                 * Reference of the parent state instance HTMLAudio
                 * @memberof HTMLAudio
                 * @name state
                 */
                this.state = this.parent.state; // ref
                /**
                 * Reference of the parent HTMLAudioElement instance HTMLAudio
                 * @memberof HTMLAudio
                 * @name state
                 */
                this.$el = this.parent.$el; // ref
                //this.onEnded = this.parent.onEnded; // TODO: ref
                this.sprite = new Sprite(undefined, current); // new
            } else {
                this.state = {
                    time: {
                        playback: undefined, // Playback start time (unixtime)
                        pause: undefined // // Seek time paused
                    },
                    loop: boombox.LOOP_NOT, // Loop playback flags
                    power: boombox.POWER_ON, // Power flag
                    loaded: false, // Audio file is loaded
                    error: undefined // error state
                };
                this.$el = new w.Audio();
            }
        }

        _createClass(HTMLAudio, [{
            key: 'load',
            value: function load() {
                var _this2 = this;

                var options = arguments[0] === undefined ? { preload: 'auto', autoplay: false, loop: false, muted: false, controls: false } : arguments[0];
                var callback = arguments[1] === undefined ? none : arguments[1];

                /**
                 * Loading html audio
                 *
                 * @memberof HTMLAudio
                 * @name load
                 * @method
                 * @param {Object} options
                 * @param {Function} callback
                 * @return {HTMLAudio}
                 * @example
                 * .load({
                 *     src: '', // required
                 *     type: '', // optional
                 *     media: '', // optional
                 *     preload: 'auto', // optional
                 *     autoplay: false, // optional
                 *     mediagroup: 'boombox', // optional
                 *     loop: false, // optional
                 *     muted: false, // optional
                 *     crossorigin: "anonymous", // optional
                 *     controls: false // optional
                 *     timeout: 15 * 1000 // optional default) 15s
                 * }, function callback() {});
                 *
                 */
                if (this.parent) {
                    // skip audiosprite children
                    callback(null, this);
                    return this;
                }

                var timeout = options.timeout || 15 * 1000;
                delete options.timeout;

                if (options.spritemap) {
                    // Sprite ON
                    this.sprite = new Sprite(options.spritemap);
                    delete options.spritemap;
                }

                for (var k in options) {
                    var v = options[k];
                    this.logger.trace('HTMLAudioElement attribute:', k, v);
                    this.$el[k] = v;
                }

                // Debug log
                /**
                ["loadstart",
                 "progress",
                 "suspend",
                 "load",
                 "abort",
                 "error",
                 "emptied",
                 "stalled",
                 "play",
                 "pause",
                 "loadedmetadata",
                 "loadeddata",
                 "waiting",
                 "playing",
                 "canplay",
                 "canplaythrough",
                 "seeking",
                 "seeked",
                 "timeupdate",
                 "ended",
                 "ratechange",
                 "durationchange",
                 "volumechange"].forEach(function (eventName) {
                     self.$el.addEventListener(eventName, function () {
                         console.log('audio: ' + eventName);
                     }, true);
                 });
                 */

                var hookEventName = 'canplay';
                var ua_ios = window.navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
                if (ua_ios && 0 < ua_ios.length) {
                    // IOS Safari
                    hookEventName = 'suspend';
                }

                this.logger.trace('hook event name:', hookEventName);

                this.$el.addEventListener(hookEventName, (function _canplay(e) {
                    this.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                    this.state.loaded = true;

                    this.$el.removeEventListener(hookEventName, _canplay, false);

                    return callback(null, this);
                }).bind(this));

                this.$el.addEventListener('ended', function (e) {
                    _this2._onEnded(e);
                }, false);

                // communication time-out
                setTimeout(function () {
                    if (_this2.$el && _this2.$el.readyState !== 4) {
                        _this2.$el.src = '';
                        callback(new Error('load of html audio file has timed out. timeout:' + timeout), _this2);
                        callback = function () {};
                    }
                }, timeout);

                this.$el.load();

                return this;
            }
        }, {
            key: 'isUse',
            value: function isUse() {
                /**
                 * Is use.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isUse
                 * @return {Boolean}
                 */
                if (this.state.power === boombox.POWER_OFF || boombox.state.power === boombox.POWER_OFF) {
                    return false;
                }

                if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                    return false;
                }

                return true;
            }
        }, {
            key: 'isPlayback',
            value: function isPlayback() {
                /**
                 * Is playing.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isPlayback
                 * @return {Boolean}
                 */
                return !!this.state.time.playback;
            }
        }, {
            key: 'isStop',
            value: function isStop() {
                /**
                 * Is stoped.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isStop
                 * @return {Boolean}
                 */
                return !this.state.time.playback;
            }
        }, {
            key: 'isPause',
            value: function isPause() {
                /**
                 * Is paused.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isPause
                 * @return {boolean}
                 */
                return !!this.state.time.pause;
            }
        }, {
            key: 'isLoop',
            value: function isLoop() {
                /**
                 * Loop flag
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isLoop
                 * @return {Interger}
                 */
                return 0 < this.state.loop;
            }
        }, {
            key: 'isParentSprite',
            value: function isParentSprite() {
                /**
                 * Is sprite of the parent
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isParentSprite
                 * @return {Boolean}
                 */
                return !!(!this.parent && this.sprite && !this.sprite.current);
            }
        }, {
            key: 'isSprite',
            value: function isSprite() {
                /**
                 * Is sprite
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isSprite
                 * @return {Boolean}
                 */
                return !!(this.parent && this.sprite && this.sprite.current);
            }
        }, {
            key: 'clearTimerAll',
            value: function clearTimerAll() {
                /**
                 * Clear all the setTimeout
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name clearTimerAll
                 * @return {HTMLAudio}
                 */
                for (var k in this._timer) {
                    var id = this._timer[k];
                    this.clearTimer(k);
                }
                return this;
            }
        }, {
            key: 'clearTimer',
            value: function clearTimer(name) {
                /**
                 * Clear specified setTimeout
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name clearTimer
                 * @param {String} name
                 * @return {Interger}
                 */
                var id = this._timer[name];
                if (id) {
                    this.logger.debug('remove setTimetout:', id);
                    clearTimeout(id);
                    delete this._timer[name];
                }

                return id;
            }
        }, {
            key: 'setTimer',
            value: function setTimer(name, id) {
                /**
                 * Save the specified setTimeout
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name setTimer
                 * @param {String} name
                 * @param {Interger} id setTimeout#id
                 * @return {Interger}
                 */
                if (this._timer[name]) {
                    this.logger.warn('Access that is not expected:', name, id);
                }
                this._timer[name] = id;

                return this._timer[name];
            }
        }, {
            key: 'play',
            value: function play(resume) {
                var _this3 = this;

                /**
                 * audio play.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name play
                 * @param {Boolean} resume resume flag
                 * @return {HTMLAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip play:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.isPlayback()) {
                    this.logger.debug('skip play:', this.name, 'is playing');
                    return this;
                }

                var type = 'play';
                var fn = none;

                this.state.time.playback = Date.now();

                if (resume && this.state.time.pause) {
                    // resume
                    this.setCurrentTime(this.state.time.pause);

                    if (this.isSprite()) {
                        var _pause = this.state.time.pause;
                        fn = function () {
                            var interval = Math.ceil((_this3.sprite.current.end - _pause) * 1000); // (ms)

                            _this3.setTimer('play', setTimeout(function () {
                                this.stop();
                                this._onEnded(); // fire onended evnet
                            }, interval));
                        };
                    }

                    this.state.time.pause = undefined;

                    type = 'resume:';
                } else {
                    // zero-play
                    this.setCurrentTime(0);

                    if (this.isSprite()) {
                        var start = this.sprite.current.start;
                        this.setCurrentTime(start);

                        fn = function () {
                            var interval = Math.ceil(self.sprite.current.term * 1000); // (ms)
                            self.setTimer('play', setTimeout(function () {
                                self.stop();
                                self._onEnded(); // fire onended evnet
                            }, interval));
                        };
                    }
                }

                this.logger.debug(type, this.name);
                fn();
                this.state.time.name = this.name;
                this.$el.play();

                return this;
            }
        }, {
            key: 'stop',
            value: function stop() {
                /**
                 * audio stop.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name stop
                 * @return {HTMLAudio}
                 */
                if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                    this.logger.debug('skip stop:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.state.time.name && this.state.time.name !== this.name) {
                    this.logger.debug('skip stop: It is used in other sources', this.name, this.state.time.name);
                    return this;
                } // skip!!

                this.logger.debug('stop:', this.name);
                this.clearTimer('play');
                this.$el.pause();
                this.setCurrentTime(0);
                this.state.time.playback = undefined;
                this.state.time.name = undefined;
                return this;
            }
        }, {
            key: 'pause',
            value: function pause() {
                /**
                 * audio stop.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name stop
                 * @return {HTMLAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip pause:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.state.time.name && this.state.time.name !== this.name) {
                    this.logger.debug('skip pause: It is used in other sources', this.name, this.state.time.name);
                    return this;
                } // skip!!

                this.logger.debug('pause:', this.name);
                this.clearTimer('play');
                this.$el.pause();
                this.state.time.pause = this.$el.currentTime;
                this.state.time.playback = undefined;

                return this;
            }
        }, {
            key: 'resume',
            value: function resume() {
                /**
                 * audio resume.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name resume
                 * @return {HTMLAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip resume:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.state.time.name && this.state.time.name !== this.name) {
                    this.logger.debug('skip resume: It is used in other sources', this.name, this.state.time.name);
                    return this;
                } // skip!!

                if (this.state.time.pause) {
                    this.play(true);
                }
                return this;
            }
        }, {
            key: 'replay',
            value: function replay() {
                /**
                 * audio re-play.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name replay
                 * @return {HTMLAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip replay:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                this.logger.debug('replay:', this.name);
                this.clearTimer('play');
                this.pause();
                this.setCurrentTime(0);
                this.play();
                return this;
            }
        }, {
            key: 'volume',
            value: function volume(v) {
                /**
                 * audio change volume.
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name volume
                 * @param {Interger} v volume
                 * @return {HTMLAudio}
                 */
                this.logger.trace('volume:', this.name, 'volume:', v);
                this.$el.volume = Math.max(0, Math.min(1, v));
            }
        }, {
            key: '_onEnded',
            value: function _onEnded(e) {
                /**
                 * Audio.ended events
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name _onEnded
                 * @param {Event} e event
                 */
                if (this.isDisposed()) {
                    // check dispose
                    return;
                }
                this.logger.trace('onended fire! name:', this.name);
                this.state.time.playback = undefined;
                this.state.time.name = undefined;

                this.onEnded(e); // fire user ended event!!

                if (this.isDisposed()) {
                    // check dispose
                    return;
                }
                if (this.state.loop === boombox.LOOP_ORIGINAL && typeof this.state.time.pause === 'undefined') {
                    this.logger.trace('onended original loop play.', this.name);
                    this.play();
                }
            }
        }, {
            key: 'onEnded',
            value: function onEnded() {
                /**
                 * Override Audio.ended events
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name onEnded
                 * @param {Event} e event
                 */
                none();
            }
        }, {
            key: 'setLoop',
            value: function setLoop(loop) {
                /**
                 * Set loop flag
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name setLoop
                 * @param {Interger} loop loop flag (Boombox.LOOP_XXX)
                 * @return {HTMLAudio}
                 */
                if (!this.isUse()) {
                    return this;
                } // skip!!

                this.state.loop = loop;
                if (loop === boombox.LOOP_NOT) {
                    this.$el.loop = boombox.LOOP_NOT;

                    //} else if (loop === boombox.LOOP_ORIGINAL) {
                } else if (loop === boombox.LOOP_NATIVE) {
                    if (this.isSprite()) {
                        this.logger.warn('audiosprite does not support the native. please use the original loop.');
                        return this;
                    }
                    if (this.$el) {
                        this.$el.loop = loop;
                    }
                }

                return this;
            }
        }, {
            key: 'power',
            value: function power(p) {
                /**
                 * Change power on/off
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name power
                 * @param {Boolean} p power on/off. Boombox.(POWER_ON|POWER_OFF)
                 * @return {HTMLAudio}
                 */
                this.logger.trace('power:', this.name, 'flag:', p);
                if (p === boombox.POWER_OFF) {
                    this.stop(); // force pause
                }
                this.state.power = p;

                return this;
            }
        }, {
            key: 'setCurrentTime',
            value: function setCurrentTime(t) {
                /**
                 * Set audio.currentTime
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name setCurrentTime
                 * @param {Interger} t set value(HTMLAudioElement.currentTime)
                 * @return {HTMLAudio}
                 */
                try {
                    this.$el.currentTime = t;
                } catch (e) {
                    this.logger.error('Set currentTime.', e.message);
                }
                return this;
            }
        }, {
            key: 'isDisposed',
            value: function isDisposed() {
                /**
                 * Check disposed
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name isDisposed
                 */
                return WebAudio.prototype.isDisposed.apply(this, arguments);
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                /**
                 * Dispose
                 *
                 * @memberof HTMLAudio
                 * @method
                 * @name dispose
                 */
                delete this.name;
                delete this.state.time.playback;
                delete this.state.time.pause;
                delete this.state.time.name;
                delete this.state.time;
                delete this.state.loop;
                delete this.state.power;
                delete this.state.loaded;
                delete this.state.error;
                delete this.state;
                this.$el.src = undefined;
                delete this.$el;

                this.clearTimerAll();
                delete this._timer;

                delete this.parent;
                if (this.sprite && this.sprite.dispose) {
                    this.sprite.dispose();
                }
                delete this.sprite;
            }
        }]);

        return HTMLAudio;
    })();

    //////////////////////////////////
    // HTMLVideo Class

    var HTMLVideo = (function (_HTMLAudio) {
        function HTMLVideo(name, parent) {
            _classCallCheck(this, HTMLVideo);

            _get(Object.getPrototypeOf(HTMLVideo.prototype), 'constructor', this).call(this, name, parent);
            /**
             * logger
             * @memberof HTMLVideo
             * @name logger
             */
            this.logger = new Logger('HTMLVideo');

            /**
             * unique name
             * @memberof HTMLVideo
             * @name name
             */
            this.name = name;

            /**
             * SetTimeout#id pool running
             * @memberof HTMLVideo
             * @name _timer
             */
            this._timer = {}; // setTimeout#id

            /**
             * AudioSprite option data
             * @memberof HTMLVideo
             * @name sprite
             */
            this.sprite = undefined;
            if (parent) {
                var sprite_n = getSpriteName(name);

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];

                /**
                 * Reference of the parent instance HTMLVideo
                 * @memberof HTMLVideo
                 * @name parent
                 */
                this.parent = parent; // ref

                /**
                 * Reference of the parent state instance HTMLVideo
                 * @memberof HTMLVideo
                 * @name state
                 */
                this.state = this.parent.state; // ref

                /**
                 * Reference of the parent HTMLVideoElement instance HTMLVideo
                 * @memberof HTMLAudio
                 * @name state
                 */
                this.$el = this.parent.$el; // ref
                //this.onEnded = this.parent.onEnded; // TODO: ref
                this.sprite = new Sprite(undefined, current); // new
            } else {
                this.state = {
                    time: {
                        playback: undefined, // Playback start time (unixtime)
                        pause: undefined // // Seek time paused
                    },
                    loop: boombox.LOOP_NOT, // Loop playback flags
                    power: boombox.POWER_ON, // Power flag
                    loaded: false, // Video file is loaded
                    error: undefined // error state
                };
                this.$el = document.createElement('video');
            }
        }

        _inherits(HTMLVideo, _HTMLAudio);

        _createClass(HTMLVideo, [{
            key: 'load',
            value: function load() {
                var _this4 = this;

                var options = arguments[0] === undefined ? { preload: 'auto', autoplay: false, loop: false, muted: false, controls: false } : arguments[0];
                var callback = arguments[1] === undefined ? none : arguments[1];

                /**
                 * Loading html video
                 *
                 * @memberof HTMLVideo
                 * @name load
                 * @method
                 * @param {Object} options
                 * @param {Function} callback
                 * @return {HTMLVideo}
                 * @example
                 * .load({
                 *     src: '', // required
                 *     type: '', // optional
                 *     media: '', // optional
                 *     preload: 'auto', // optional
                 *     autoplay: false, // optional
                 *     mediagroup: 'boombox', // optional
                 *     loop: false, // optional
                 *     muted: false, // optional
                 *     crossorigin: "anonymous", // optional
                 *     controls: false // optional
                 *     timeout: 15 * 1000 // optional default) 15s
                 * }, function callback() {});
                 *
                 */
                if (this.parent) {
                    // skip audiosprite children
                    callback(null, this);
                    return this;
                }

                var timeout = options.timeout || 15 * 1000;
                delete options.timeout;

                if (options.spritemap) {
                    // Sprite ON
                    this.sprite = new Sprite(options.spritemap);
                    delete options.spritemap;
                }

                for (var k in options) {
                    var v = options[k];
                    self.logger.trace('HTMLVideoElement attribute:', k, v);
                    self.$el[k] = v;
                }

                /// Debug log
                /**
                ["loadstart",
                 "progress",
                 "suspend",
                 "load",
                 "abort",
                 "error",
                 "emptied",
                 "stalled",
                 "play",
                 "pause",
                 "loadedmetadata",
                 "loadeddata",
                 "waiting",
                 "playing",
                 "canplay",
                 "canplaythrough",
                 "seeking",
                 "seeked",
                 "timeupdate",
                 "ended",
                 "ratechange",
                 "durationchange",
                 "volumechange"].forEach(function (eventName) {
                     self.$el.addEventListener(eventName, function () {
                         console.log('audio: ' + eventName);
                     }, true);
                 });
                 */

                var hookEventName = 'canplay';
                var ua_ios = window.navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
                if (ua_ios && 0 < ua_ios.length) {
                    // IOS Safari
                    hookEventName = 'suspend';
                } else if (!!window.navigator.userAgent.match(/(Android)\s+(4)([\d.]+)/)) {
                    // Android 4 basic
                    hookEventName = 'loadeddata';
                } else if (!!window.navigator.userAgent.match(/(Android)\s+(2)([\d.]+)/)) {
                    // Android 2 basic
                    hookEventName = 'stalled';
                }

                this.logger.trace('hook event name:', hookEventName);

                this.$el.addEventListener(hookEventName, (function _canplay(e) {
                    this.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                    this.state.loaded = true;

                    this.$el.removeEventListener(hookEventName, _canplay, false);

                    return callback(null, this);
                }).bind(this));

                this.$el.addEventListener('ended', function (e) {
                    _this4._onEnded(e);
                }, false);

                // communication time-out
                setTimeout(function () {
                    if (_this4.$el && _this4.$el.readyState !== 4) {
                        _this4.$el.src = '';
                        callback(new Error('load of html video file has timed out. timeout:' + timeout), _this4);
                        callback = function () {};
                    }
                }, timeout);

                this.$el.load();

                return this;
            }
        }, {
            key: 'isUse',
            value: function isUse() {
                /**
                 * Is use. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name isUse
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isUse', this).call(this);
            }
        }, {
            key: 'isPlayback',
            value: function isPlayback() {
                /**
                 * Is playing. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name isPlayback
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isPlayback', this).call(this);
            }
        }, {
            key: 'isStop',
            value: function isStop() {
                /**
                 * Is stoped.
                 *
                 * @memberof HTMLVideo (apply HTMLAudio)
                 * @method
                 * @name isStop
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isStop', this).call(this);
            }
        }, {
            key: 'isPause',
            value: function isPause() {
                /**
                 * Is paused.
                 *
                 * @memberof HTMLVideo (apply HTMLAudio)
                 * @method
                 * @name isPause
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isPause', this).call(this);
            }
        }, {
            key: 'isLoop',
            value: function isLoop() {
                /**
                 * Loop flag (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name isLoop
                 * @return {Interger}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isLoop', this).call(this);
            }
        }, {
            key: 'isParentSprite',
            value: function isParentSprite() {
                /**
                 * Is sprite of the parent (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name isParentSprite
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isParentSprite', this).call(this);
            }
        }, {
            key: 'isSprite',
            value: function isSprite() {
                /**
                 * Is sprite (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name isSprite
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isSprite', this).call(this);
            }
        }, {
            key: 'clearTimerAll',
            value: function clearTimerAll() {
                /**
                 * Clear all the setTimeout (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name clearTimerAll
                 * @return {HTMLAudio}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'clearTimerAll', this).call(this);
            }
        }, {
            key: 'clearTimer',
            value: function clearTimer(name) {
                /**
                 * Clear specified setTimeout (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name clearTimer
                 * @param {String} name
                 * @return {Interger}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'clearTimer', this).call(this, name);
            }
        }, {
            key: 'setTimer',
            value: function setTimer(name, id) {
                /**
                 * Save the specified setTimeout (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name setTimer
                 * @param {String} name
                 * @param {Interger} id setTimeout#id
                 * @return {Interger}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'setTimer', this).call(this, name, id);
            }
        }, {
            key: 'play',
            value: function play(resume) {
                var _this5 = this;

                /**
                 * video play.
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name play
                 * @param {Boolean} resume resume flag
                 * @return {HTMLVideo}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip play:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.isPlayback()) {
                    this.logger.debug('skip play:', this.name, 'is playing');
                    return this;
                }

                var type = 'play';
                var fn = none;

                this.state.time.playback = Date.now();

                if (resume && this.state.time.pause) {
                    // resume
                    this.setCurrentTime(this.state.time.pause);

                    if (this.isSprite()) {
                        var _pause = this.state.time.pause;
                        fn = function () {
                            var interval = Math.ceil((_this5.sprite.current.end - _pause) * 1000); // (ms)

                            _this5.setTimer('play', setTimeout(function () {
                                this.stop();
                                this._onEnded(); // fire onended evnet
                            }, interval));
                        };
                    }

                    this.state.time.pause = undefined;

                    type = 'resume:';
                } else {
                    // zero-play
                    this.setCurrentTime(0);

                    if (this.isSprite()) {
                        var start = this.sprite.current.start;
                        this.setCurrentTime(start);

                        fn = function () {
                            var interval = Math.ceil(_this5.sprite.current.term * 1000); // (ms)
                            _this5.setTimer('play', setTimeout(function () {
                                this.stop();
                                this._onEnded(); // fire onended evnet
                            }, interval));
                        };
                    }
                }

                this.logger.debug(type, this.name);
                fn();
                this.state.time.name = this.name;
                this.$el.play();

                return this;
            }
        }, {
            key: 'stop',
            value: function stop() {
                /**
                 * video stop. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name stop
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'stop', this).call(this);
            }
        }, {
            key: 'pause',
            value: function pause() {
                /**
                 * video pause. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name pause
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'pause', this).call(this);
            }
        }, {
            key: 'resume',
            value: function resume() {
                /**
                 * video resume. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name resume
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'resume', this).call(this);
            }
        }, {
            key: 'replay',
            value: function replay() {
                /**
                 * video re-play. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name replay
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'replay', this).call(this);
            }
        }, {
            key: 'volume',
            value: function volume(v) {
                /**
                 * audio change volume. (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name volume
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'volume', this).call(this, v);
            }
        }, {
            key: '_onEnded',
            value: function _onEnded(e) {
                /**
                 * Video.ended events (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name _onEnded
                 * @param {Event} e event
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), '_onEnded', this).call(this, e);
            }
        }, {
            key: 'onEnded',
            value: function onEnded() {
                /**
                 * Override Video.ended events (apply HTMLAudio)
                 *
                 * @OVERRIDE ME
                 * @memberof HTMLVideo
                 * @method
                 * @name onEnded
                 * @param {Event} e event
                 */
                none();
            }
        }, {
            key: 'setLoop',
            value: function setLoop(loop) {
                /**
                 * Set loop flag (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name setLoop
                 * @param {Interger} loop loop flag (Boombox.LOOP_XXX)
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'setLoop', this).call(this, loop);
            }
        }, {
            key: 'power',
            value: function power(p) {
                /**
                 * Change power on/off (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name power
                 * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'power', this).call(this, p);
            }
        }, {
            key: 'setCurrentTime',
            value: function setCurrentTime(t) {
                /**
                 * Set video.currentTime (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name setCurrentTime
                 * @param {Interger} t set value(Video.currentTime)
                 * @return {HTMLVideo}
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'setCurrentTime', this).call(this, t);
            }
        }, {
            key: 'isDisposed',
            value: function isDisposed() {
                /**
                 * Check disposed
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name isDisposed
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'isDisposed', this).call(this);
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                /**
                 * Dispose (apply HTMLAudio)
                 *
                 * @memberof HTMLVideo
                 * @method
                 * @name dispose
                 */
                _get(Object.getPrototypeOf(HTMLVideo.prototype), 'dispose', this).call(this);
            }
        }]);

        return HTMLVideo;
    })(HTMLAudio);

    //////////////////////////////////
    // WebAudio Class

    var WebAudio = (function (_HTMLAudio2) {
        function WebAudio(name, parent) {
            _classCallCheck(this, WebAudio);

            _get(Object.getPrototypeOf(WebAudio.prototype), 'constructor', this).call(this, name, parent);
            /**
             * logger
             * @memberof WebAudio
             * @name logger
             */
            this.logger = new Logger('WebAudio');

            /**
             * Audio name
             *
             * @memberof WebAudio
             * @name name
             * @type {String}
             */
            this.name = name;

            /**
             * SetTimeout#id pool running
             * @memberof WebAudio
             * @name _timer
             */
            this._timer = {};

            /**
             * AudioSprite option data
             * @memberof WebAudio
             * @name sprite
             */
            this.sprite = undefined;

            /**
             * AudioBuffer in use
             *
             * @memberof WebAudio
             * @name buffer
             * @type {AudioBuffer}
             */
            this.buffer = undefined;

            /**
             * AudioBufferSourceNode in use
             *
             * @memberof WebAudio
             * @name source
             * @type {AudioBufferSourceNode}
             */
            this.source = undefined;

            /**
             * WebAudioContext in use
             *   shortcut: boombox.WEB_AUDIO_CONTEXT
             *
             * @memberof WebAudio
             * @name ctx
             * @type {AudioContext}
             */
            this.ctx = boombox.WEB_AUDIO_CONTEXT;

            /**
             * WebAudioContext.GainNode instance
             * @memberof WebAudio
             * @name gainNode
             * @type {GainNode}
             */
            this.gainNode = this.ctx.createGain();

            /**
             * State of Audio
             *
             * @memberof WebAudio
             * @name state
             * @type {Object}
             */
            this.state = {
                time: {
                    playback: undefined, // Playback start time (unixtime)
                    pause: undefined, // Seek time paused
                    progress: 0 // Sound progress time
                },
                loop: boombox.LOOP_NOT, // Loop playback flags
                power: boombox.POWER_ON, // power flag
                loaded: false, // Audio file is loaded
                error: undefined // error state
            };

            if (parent) {
                var sprite_n = getSpriteName(name);

                this.parent = parent; // ref
                //this.state = this.parent.state; // ref
                this.state.loaded = this.parent.state.loaded; // not ref copy
                this.state.error = this.parent.state.error; // not ref copy

                //this.$el = this.parent.$el; // ref
                //this.onEnded = this.parent.onEnded; // TODO: ref

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];
                this.sprite = new Sprite(undefined, current); // new
            }
        }

        _inherits(WebAudio, _HTMLAudio2);

        _createClass(WebAudio, [{
            key: 'load',
            value: function load() {
                var _this6 = this;

                var options = arguments[0] === undefined ? {} : arguments[0];
                var callback = arguments[1] === undefined ? none : arguments[1];

                /**
                 * Loading web audio
                 *
                 * @memberof WebAudio
                 * @name load
                 * @method
                 * @param {Object} options
                 * @param {Function} callback
                 * @return {WebAudio}
                 * @example
                 * .load({
                 *     src: 'http://example.com/audio.m4a',
                 *     timeout: 15 * 1000
                 * }, function callback() {});
                 *
                 */
                if (this.parent) {
                    //this.buffer = this.parent.buffer; // ref
                    callback(null, this);
                    return this;
                }

                if (options.spritemap) {
                    // Sprite ON
                    this.sprite = new Sprite(options.spritemap);
                    delete options.spritemap;
                }

                for (var k in options) {
                    var v = options[k];
                    this.logger.trace('WebAudio attribute:', k, v);
                }

                var http = new XMLHttpRequest();
                http.onload = function (e) {
                    if (e.target.status.toString().charAt(0) === '2') {
                        _this6.ctx.decodeAudioData(http.response, function (buffer) {
                            if (!buffer) {
                                _this6.logger.error('error decode file data: ', options.url);
                                return callback(new Error('error decode file data'), _this6);
                            }

                            _this6.buffer = buffer;

                            _this6.state.loaded = true;

                            /////
                            // audiosprite propagation
                            if (_this6.isParentSprite()) {
                                for (var k in boombox.pool) {
                                    if (!! ~k.indexOf(_this6.name + SPRITE_SEPARATOR)) {
                                        boombox.pool[k].buffer = buffer; // ref buffer
                                        boombox.pool[k].state.loaded = _this6.state.loaded; // not ref copy
                                    }
                                }
                            }

                            return callback(null, _this6);
                        }, function () {
                            return callback(new Error('fail to decode file data'), _this6);
                        });
                    } else {
                        _this6.logger.error('fail to load resource: ', options.url);
                        return callback(new Error('fail to load resource'), _this6);
                    }
                };

                //http.timeout = 1;
                var timeout = options.timeout || 15 * 1000;

                // communication time-out
                setTimeout(function () {
                    if (http.readyState !== 4) {
                        http.abort();
                        callback(new Error('load of web audio file has timed out. timeout:' + timeout), _this6);
                        callback = none;
                    }
                }, timeout);

                http.open('GET', options.src, true);

                http.responseType = 'arraybuffer';

                /////////////////////
                /// XHR send!!
                http.send();

                return this;
            }
        }, {
            key: 'isUse',
            value: function isUse() {
                /**
                 * Is use. (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isUse
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'isUse', this).call(this);
            }
        }, {
            key: 'isPlayback',
            value: function isPlayback() {
                /**
                 * Is playing. (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isPlayback
                 * @return {Boolean}
                 */
                return !!this.source && !!this.state.time.playback && !this.state.time.pause && (this.source.playbackState === 1 || this.source.playbackState === 2);
            }
        }, {
            key: 'isStop',
            value: function isStop() {
                /**
                 * Is stoped. (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isStop
                 * @return {Boolean}
                 */
                return !this.source;
            }
        }, {
            key: 'isPause',
            value: function isPause() {
                /**
                 * Is paused. (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isPause
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'isPause', this).call(this);
            }
        }, {
            key: 'isLoop',
            value: function isLoop() {
                /**
                 * Loop flag (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isLoop
                 * @return {Interger}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'isLoop', this).call(this);
            }
        }, {
            key: 'isParentSprite',
            value: function isParentSprite() {
                /**
                 * Is sprite of the parent (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isParentSprite
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'isParentSprite', this).call(this);
            }
        }, {
            key: 'isSprite',
            value: function isSprite() {
                /**
                 * Is sprite of the parent (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name isParentSprite
                 * @return {Boolean}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'isSprite', this).call(this);
            }
        }, {
            key: 'clearTimerAll',
            value: function clearTimerAll() {
                /**
                 * Clear all the setTimeout (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name clearTimerAll
                 * @return {WebAudio}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'clearTimerAll', this).call(this);
            }
        }, {
            key: 'clearTimer',
            value: function clearTimer(name) {
                /**
                 * Clear specified setTimeout (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name clearTimer
                 * @param {String} name
                 * @return {Interger}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'clearTimer', this).call(this, name);
            }
        }, {
            key: 'setTimer',
            value: function setTimer(name, id) {
                /**
                 * Save the specified setTimeout (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name setTimer
                 * @param {String} name
                 * @param {Interger} id setTimeout#id
                 * @return {Interger}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'setTimer', this).call(this, name, id);
            }
        }, {
            key: 'play',
            value: function play(resume) {
                var _this7 = this;

                /**
                 * audio play.
                 *
                 * @memberof WebAudio
                 * @method
                 * @name play
                 * @return {WebAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip play:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.isPlayback()) {
                    this.logger.debug('skip play:', this.name, 'is playing');
                    return this;
                }

                if (!resume) {
                    this.sourceDispose();
                }

                this.source = this.ctx.createBufferSource();

                if (this.state.loop === boombox.LOOP_NATIVE) {
                    this.source.loop = this.state.loop;
                }

                this.source.buffer = this.buffer;

                this.source.connect(this.gainNode);
                this.gainNode.connect(this.ctx.destination);

                var type = 'play';
                var fn = none;
                var start = 0;

                this.state.time.playback = Date.now(); // Playback start time (ms)

                if (resume && this.state.time.pause) {
                    // resume
                    start = this.state.time.pause / 1000; // Start position (sec)
                    //this.logger.trace('start:', start);
                    //this.logger.warn('interval:', interval);

                    if (this.isSprite()) {
                        var pause_sec = this.state.time.pause / 1000; // (sec)
                        start = this.sprite.current.start + pause_sec; // Start position (sec)
                        var interval = Math.ceil((this.sprite.current.term - pause_sec) * 1000); // (ms)
                        fn = function () {
                            _this7.setTimer('play', setTimeout(function () {
                                _this7.stop();
                                _this7._onEnded(); // fire onended evnet
                            }, interval));
                        };
                    }

                    this.state.time.pause = undefined;
                } else {
                    // zero

                    if (this.isSprite()) {
                        start = this.sprite.current.start;

                        fn = function () {
                            var interval = Math.ceil(_this7.sprite.current.term * 1000);

                            _this7.setTimer('play', setTimeout(function () {
                                _this7.stop();
                                _this7._onEnded(); // fire onended evnet
                            }, interval));
                        };
                    }
                }

                this.logger.debug(type, this.name, 'offset:', start);
                fn();

                var duration = this.buffer.duration - start;
                if (!this.isSprite()) {
                    if (this.source.hasOwnProperty('onended')) {
                        this.source.onended = function (e) {
                            _this7._onEnded(e);
                        };
                    } else {
                        var interval = Math.ceil(duration * 1000);
                        this.setTimer('play', setTimeout(function () {
                            _this7.stop();
                            _this7._onEnded();
                        }, interval));
                    }
                }

                if (this.source.start) {
                    this.logger.debug('use source.start()', this.name, start, duration);
                    this.source.start(0, start, this.buffer.duration);
                } else {
                    if (this.isSprite()) {
                        duration = this.sprite.current.term;
                    }
                    this.logger.debug('use source.noteGrainOn()', this.name, start, duration);
                    this.source.noteGrainOn(0, start, duration);
                }

                return this;
            }
        }, {
            key: 'stop',
            value: function stop() {
                /**
                 * audio stop.
                 *
                 * @memberof WebAudio
                 * @method
                 * @name stop
                 * @return {WebAudio}
                 */
                if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                    this.logger.debug('skip stop:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                this.logger.debug('stop:', this.name);

                this.clearTimer('play');

                if (this.source) {
                    if (this.source.stop) {
                        this.logger.debug('stop: use source.stop()', this.name);
                        this.source.stop(0);
                    } else {
                        this.logger.debug('stop: use source.noteOff()', this.name);
                        this.source.noteOff(0);
                    }
                }

                this.sourceDispose();

                return this;
            }
        }, {
            key: 'pause',
            value: function pause() {
                /**
                 * audio pause.
                 *
                 * @memberof WebAudio
                 * @method
                 * @name pause
                 * @return {WebAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip pause:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (!this.source) {
                    this.logger.debug('skip pause, Not playing.');
                    return this;
                }
                if (this.state.time.pause) {
                    this.logger.debug('skip pause, It is already paused.');
                    return this;
                }

                var now = Date.now();
                var offset = now - this.state.time.playback;
                this.state.time.pause = this.state.time.progress + offset; // Pause time(ms)
                this.state.time.progress += offset;
                this.logger.trace('state.time.pause:', this.state.time.pause, 'now:', now, 'state.time.playback', this.state.time.playback);

                this.logger.debug('pause:', this.name);
                this.clearTimer('play');

                if (this.source) {
                    if (this.source.stop) {
                        this.logger.debug('pause: use source.stop()', this.name);
                        this.source.stop(0);
                    } else {
                        this.logger.debug('pause: use source.noteOff()', this.name);
                        this.source.noteOff(0);
                    }
                }

                return this;
            }
        }, {
            key: 'resume',
            value: function resume() {
                /**
                 * audio resume.
                 *
                 * @memberof WebAudio
                 * @method
                 * @name resume
                 * @return {WebAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip resume:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                if (this.state.time.pause) {
                    this.play(true);
                }
                return this;
            }
        }, {
            key: 'replay',
            value: function replay() {
                /**
                 * audio re-play.
                 *
                 * @memberof WebAudio
                 * @method
                 * @name replay
                 * @return {WebAudio}
                 */
                if (!this.isUse()) {
                    this.logger.debug('skip replay:', this.name, 'state can not be used');
                    return this;
                } // skip!!

                this.logger.debug('replay:', this.name);
                this.clearTimer('play');

                this.sourceDispose();
                this.play();
                return this;
            }
        }, {
            key: 'volume',
            value: function volume(v) {
                /**
                 * audio change volume.
                 *
                 * @memberof WebAudio
                 * @method
                 * @name volume
                 * @return {WebAudio}
                 */
                this.logger.trace('volume:', this.name, 'volume:', v);
                this.gainNode.gain.value = v;
            }
        }, {
            key: '_onEnded',
            value: function _onEnded(e) {
                /**
                 * Audio.ended events
                 *
                 * @memberof WebAudio
                 * @method
                 * @name _onEnded
                 * @param {Event} e event
                 */
                // check dispose
                if (this.isDisposed()) {
                    return;
                }

                var self = this;
                var now = Date.now();

                // skip if sounds is not ended
                if (self.source && Math.abs((now - self.state.time.playback + self.state.time.progress) / 1000 - self.source.buffer.duration) >= boombox.THRESHOLD) {
                    self.logger.debug('skip if sounds is not ended', self.name);
                    return;
                }

                this.logger.trace('onended fire!', this.name);
                this.state.time.playback = undefined;
                this.onEnded(e); // fire user ended event!!

                // check dispose
                if (this.isDisposed()) {
                    return;
                }

                if (this.state.loop && typeof this.state.time.pause === 'undefined') {
                    this.logger.trace('onended loop play.');
                    this.play();
                } else {
                    this.sourceDispose();
                }
            }
        }, {
            key: 'onEnded',
            value: function onEnded() {
                /**
                 * Override Audio.ended events
                 *
                 * @memberof WebAudio
                 * @method
                 * @name onEnded
                 * @param {Event} e event
                 */
                none();
            }
        }, {
            key: 'setLoop',
            value: function setLoop(loop) {
                /**
                 * Set loop flag
                 *
                 * @memberof WebAudio
                 * @method
                 * @name setLoop
                 * @param {Interger} loop loop flag (boombox.LOOP_XXX)
                 * @return {WebAudio}
                 */
                if (!this.isUse()) {
                    return this;
                } // skip!!

                this.state.loop = loop;
                if (loop === boombox.LOOP_NOT) {
                    if (this.source) {
                        this.source.loop = boombox.LOOP_NOT;
                    }

                    //} else if (loop === boombox.LOOP_ORIGINAL) {
                } else if (loop === boombox.LOOP_NATIVE) {
                    if (this.source) {
                        this.source.loop = loop;
                    }
                }
                return this;
            }
        }, {
            key: 'power',
            value: function power(p) {
                /**
                 * Change power on/off (apply HTMLAudio)
                 *
                 * @memberof WebAudio
                 * @method
                 * @name power
                 * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
                 * @return {WebAudio}
                 */
                _get(Object.getPrototypeOf(WebAudio.prototype), 'power', this).call(this, p);
            }
        }, {
            key: 'sourceDispose',
            value: function sourceDispose() {
                /**
                 * Dispose AudioBufferSourceNode
                 *
                 * @memberof WebAudio
                 * @method
                 * @name sourceDispose
                 */
                this.logger.trace('source dispose', this.name);
                this.source && this.source.disconnect();
                this.source = undefined;
                this.state.time.playback = undefined;
                this.state.time.pause = undefined;
                this.state.time.progress = 0;
            }
        }, {
            key: 'isDisposed',
            value: function isDisposed() {
                /**
                 * Check disposed
                 * @memberof WebAudio
                 * @method
                 * @name isDisposed
                 */
                this.logger.trace('check dispose flag', !!this.state);
                return !this.state;
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                /**
                 * Dispose
                 *
                 * @memberof WebAudio
                 * @method
                 * @name dispose
                 */
                this.logger.trace('WebAudio dispose', this.name);

                delete this.buffer;

                this.sourceDispose();
                delete this.source;
                this.clearTimerAll();
                delete this._timer;

                delete this.state.time;
                delete this.state.loop;
                delete this.state.power;
                delete this.state.loaded;
                delete this.state.error;
                delete this.state;

                this.parent = null;
                delete this.parent;

                if (this.sprite && this.sprite.dispose) {
                    this.sprite.dispose();
                }
                delete this.sprite;

                delete this.name;
                this.gainNode && this.gainNode.disconnect && delete this.gainNode;
                this.ctx = null;
            }
        }]);

        return WebAudio;
    })(HTMLAudio);

    var Sprite = (function () {
        function Sprite(options, current) {
            _classCallCheck(this, Sprite);

            /**
             * logger
             * @memberof Sprite
             * @type {Logger}
             * @name logger
             */
            this.logger = new Logger('Sprite   ');
            /**
             * current options
             * @memberof Sprite
             * @type {Object}
             * @name current
             */
            this.current = current; // target sprite
            /**
             * options
             * @memberof Sprite
             * @name options
             * @type {Object}
             */
            this.options = options;
            if (!current) {
                // parent
                for (var k in this.options) {
                    this.options[k].term = this.options[k].end - this.options[k].start;
                }
            }
        }

        _createClass(Sprite, [{
            key: 'dispose',
            value: function dispose() {
                /**
                 * Dispose
                 * @memberof Sprite
                 * @method
                 * @name dispose
                 */
                this.options = null;
                delete this.options;
                delete this.current;
            }
        }]);

        return Sprite;
    })();

    // Building
    boombox.HTMLAudio = HTMLAudio;
    boombox.HTMLVideo = HTMLVideo;
    boombox.WebAudio = WebAudio;

    if (isRequire) {
        define([], function () {
            return boombox;
        });
    } else {
        w.boombox = boombox;
    }
})(window);
//# sourceMappingURL=boombox.dist.js.map