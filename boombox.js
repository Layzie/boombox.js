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

    var none = function () {};

    var isRequire = !!(typeof define === 'function' && define.amd);

    const SPRITE_SEPARATOR = '-';
    const LOGGER_DEFAULT_SEPARATOR = '-';

    var getSpriteName = function (name) {
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

    class Logger {
        constructor(prefix) {
            this.prefix = prefix || LOGGER_DEFAULT_SEPARATOR;
            this.prefix = '[' + this.prefix + ']';
        }
        trace() {
        /**
         * Log output (trace)
         * @memberof Logger
         * @name trace
         */
            if (LOG_LEVEL <= 1) {
                if (!w.console) {
                } else if (w.console.trace) {
                    w.console.trace('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                } else if (w.console.debug) {
                    w.console.debug('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                } else {
                    w.console.log('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        }
        debug() {
        /**
         * Log output (info)
         * @memberof Logger
         * @name debug
         */
            if (LOG_LEVEL <= 2) {
                if (!w.console) {
                } else if (w.console.debug) {
                    w.console.debug('[DEBUG]', this.prefix, slice.call(arguments).join(' '));
                } else {
                    w.console.log('[DEBUG]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        }
        info() {
        /**
         * Log output (info)
         * @memberof Logger
         * @name info
         */
            if (LOG_LEVEL <= 3) {
                w.console && w.console.info('[INFO]', this.prefix, slice.call(arguments).join(' '));
            }
        }
        warn() {
        /**
         * Log output (warn)
         * @memberof Logger
         * @name warn
         */
            if (LOG_LEVEL <= 4) {
                w.console && w.console.warn('[WARN]', this.prefix, slice.call(arguments).join(' '));
            }
        }
        error() {
        /**
         * Log output (error)
         * @memberof Logger
         * @name error
         */
            if (LOG_LEVEL <= 5) {
                w.console && w.console.error('[ERROR]', this.prefix, slice.call(arguments).join(' '));
            }
        }
    }

    //////////////////////////////////
    // Boombox Class

    class Boombox {
        constructor() {
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
        isWebAudio() {
        /**
         * The availability of the WebLAudio
         *
         * @memberof Boombox
         * @name isWebAudio
         * @return {Boolean}
         */
            return this.support.webaudio.use;
        }
        isHTMLAudio() {
        /**
         * The availability of the HTMLAudio
         *
         * @memberof Boombox
         * @name isHTMLAudio
         * @return {Boolean}
         */
            return this.support.htmlaudio.use;
        }
        isHTMLVideo() {
        /**
         * The availability of the HTMLVideo
         *
         * @memberof Boombox
         * @name isHTMLVideo
         * @return {Boolean}
         */
            return this.support.htmlvideo.use;
        }
        isPlayback() {
            var res = false;

            for (let name in this.pool) {
                if (this.pool[name].isPlayback()) {
                    res = true;
                    break;
                }
            }

            return res;
        }
        setup(options) {
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
        get(name) {
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
        load(name, options, useHTMLVideo, callback) {
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
                this.logger.debug("use web audio");
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
                this.logger.debug("use html audio");
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
        remove(name) {
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
        setPool(name, obj, Obj) {
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
                for (let r in this.pool) {
                    if (!! ~r.indexOf(name + SPRITE_SEPARATOR)) {
                        delete this.pool[r];
                    }
                }

                for (let n in obj.sprite.options) {
                    var cname = name + SPRITE_SEPARATOR + n;
                    var audio = new Obj(cname, obj);
                    this.pool[audio.name] = audio;
                }
            }

            this.remove(name);
            this.pool[name] = obj;

            return this;
        }
        runfilter(audio, options) {
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

            for (let i = 0; i < list.length; i++) {
                let name = list[i];

                let fn = this.filter[name];
                if (!fn) {
                    this.logger.warn('filter not found. name:', name);
                    return;
                }
                this.logger.debug('filter run. name:', name);

                if (fn(name, audio, options)) {
                    hit = name;
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
        useMediaType(src) {
        /**
         * check support media type
         *
         * @memberof Boombox
         * @name useMediaType
         * @param {Array} src audio file data
         * @return {Object|undefined}
         */
            for (let i = 0; i < src.length; i++) {
                var t = src[i];
                if (this._audio.canPlayType(t.media)) {
                    return t;
                } else {
                    this.logger.warn('skip audio type.', t.media);
                }
            }

            return undefined;
        }
        pause() {
        /**
         * pause sound playback in managing boombox
         *
         * @memberof Boombox
         * @name pause
         * @return {boombox}
         */
            var self = this;
            this.logger.trace('pause');

            for (let name in this.pool) {
                var audio = this.pool[name];
                audio.pause();
                self.waits.push(name);
            }

            return this;
        }
        resume() {
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
        power(p) {
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

            for (let name in this.pool) {
                var audio = this.pool[name];
                audio.power(p);
            }

            this.state.power = p;
            return this;
        }
        volume(v) {
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

            for (let name in this.pool) {
                var audio = this.pool[name];
                audio.volume(v);
            }

            return this;
        }
        onVisibilityChange(e) {
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
        onFocus(e) {
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
        onBlur(e) {
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
        onPageShow(e) {
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
        onPageHide(e) {
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
        _browserControl() {
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
                document.addEventListener(this.visibility.visibilityChange, (e) => {
                    this.onVisibilityChange(e);
                }, false);
            }

            // focus/blur
            if (typeof window.addEventListener !== 'undefined') {
                window.addEventListener('focus', (e) => {
                    this.onFocus(e);
                }, false);
                window.addEventListener('blur', (e) => {
                    this.onBlur(e);
                }, false);
            } else {
                window.attachEvent('onfocusin', (e) => {
                    this.onFocus(e);
                }, false);
                window.attachEvent('onfocusout', (e) => {
                    this.onBlur(e);
                }, false);
            }

            // onpage show/hide
            window.onpageshow = (e) => {
                this.onPageShow(e);
            };

            window.onpagehide = (e) => {
                this.onPageHide(e);
            };

            //
            return this;
        }
        addFilter(name, fn) {
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
        dispose() {
        /**
         * dispose
         *
         * @memberof Boombox
         * @name dispose
         */
            for (let name in this.pool) {
                let audio = this.pool[name];
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
    }


    //////////////////////////////////
    // New!!!!
    var boombox = new Boombox();


    //////////////////////////////////
    // HTMLAudio Class

    class HTMLAudio {
        constructor(name, parent) {
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
                let sprite_n = getSpriteName(name);

                // change Sprite
                let current = parent.sprite.options[sprite_n.suffix];

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
        load(options = { preload: 'auto', autoplay: false, loop: false, muted: false, controls: false }, callback = none) {
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
            if (this.parent) { // skip audiosprite children
                callback(null, this);
                return this;
            }

            var timeout = options.timeout || 15 * 1000;
            delete options.timeout;

            if (options.spritemap) { // Sprite ON
                this.sprite = new Sprite(options.spritemap);
                delete options.spritemap;
            }


            for (let k in options) {
                let v = options[k];
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
            if (ua_ios && 0 < ua_ios.length) { // IOS Safari
                hookEventName = 'suspend';
            }

            this.logger.trace('hook event name:', hookEventName);


            this.$el.addEventListener(hookEventName,  function _canplay(e) {
                this.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                this.state.loaded = true;

                this.$el.removeEventListener(hookEventName, _canplay, false);

                return callback(null, this);
            }.bind(this));

            this.$el.addEventListener(
                'ended',
                e => {
                    this._onEnded(e);
                },
                false);

            // communication time-out
            setTimeout(() => {
                if (this.$el && this.$el.readyState !== 4) {
                    this.$el.src = '';
                    callback(new Error('load of html audio file has timed out. timeout:' + timeout), this);
                    callback = () => {};
                }
            }, timeout);

            this.$el.load();

            return this;
        }
        isUse() {
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
        isPlayback() {
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
        isStop() {
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
        isPause() {
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
        isLoop() {
        /**
         * Loop flag
         *
         * @memberof HTMLAudio
         * @method
         * @name isLoop
         * @return {Interger}
         */
            return (0 < this.state.loop);
        }
        isParentSprite() {
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
        isSprite() {
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
        clearTimerAll() {
        /**
         * Clear all the setTimeout
         *
         * @memberof HTMLAudio
         * @method
         * @name clearTimerAll
         * @return {HTMLAudio}
         */
            for (let k in this._timer) {
                let id = this._timer[k];
                this.clearTimer(k);
            }
            return this;
        }
        clearTimer(name) {
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
        setTimer(name, id) {
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
        play(resume) {
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
                    fn = () => {
                        var interval = Math.ceil((this.sprite.current.end - _pause) * 1000); // (ms)

                        this.setTimer('play', setTimeout(function () {
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
        stop() {
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
        pause() {
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
        resume() {
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
        replay() {
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
        volume(v) {
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
        _onEnded(e) {
        /**
         * Audio.ended events
         *
         * @memberof HTMLAudio
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
            if (this.isDisposed()) { // check dispose
                return;
            }
            this.logger.trace('onended fire! name:', this.name);
            this.state.time.playback = undefined;
            this.state.time.name = undefined;

            this.onEnded(e); // fire user ended event!!

            if (this.isDisposed()) { // check dispose
                return;
            }
            if (this.state.loop === boombox.LOOP_ORIGINAL && typeof this.state.time.pause === 'undefined') {
                this.logger.trace('onended original loop play.', this.name);
                this.play();
            }
        }
        onEnded() {
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
        setLoop(loop) {
        /**
         * Set loop flag
         *
         * @memberof HTMLAudio
         * @method
         * @name setLoop
         * @param {Interger} loop loop flag (Boombox.LOOP_XXX)
         * @return {HTMLAudio}
         */
            if (!this.isUse()) { return this; } // skip!!

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
        power(p) {
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
        setCurrentTime(t) {
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
        isDisposed() {
        /**
         * Check disposed
         *
         * @memberof HTMLAudio
         * @method
         * @name isDisposed
         */
            return WebAudio.prototype.isDisposed.apply(this, arguments);
        }
        dispose() {
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
    }
    //////////////////////////////////
    // HTMLVideo Class

    class HTMLVideo extends HTMLAudio {
        constructor(name, parent) {
            super(name, parent);
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
        load(options = { preload: 'auto', autoplay: false, loop: false, muted: false, controls: false }, callback = none) {
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
            if (this.parent) { // skip audiosprite children
                callback(null, this);
                return this;
            }

            var timeout = options.timeout || 15 * 1000;
            delete options.timeout;

            if (options.spritemap) { // Sprite ON
                this.sprite = new Sprite(options.spritemap);
                delete options.spritemap;
            }

            for (let k in options) {
                let v = options[k];
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
            if (ua_ios && 0 < ua_ios.length) { // IOS Safari
                hookEventName = 'suspend';
            } else if (!!window.navigator.userAgent.match(/(Android)\s+(4)([\d.]+)/)) { // Android 4 basic
                hookEventName = 'loadeddata';
            } else if (!!window.navigator.userAgent.match(/(Android)\s+(2)([\d.]+)/)) { // Android 2 basic
                hookEventName = 'stalled';
            }

            this.logger.trace('hook event name:', hookEventName);

            this.$el.addEventListener(hookEventName, function _canplay(e) {
                this.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                this.state.loaded = true;

                this.$el.removeEventListener(hookEventName, _canplay, false);

                return callback(null, this);
            }.bind(this));

            this.$el.addEventListener(
                'ended',
                 e => {
                    this._onEnded(e);
                },
                false);

            // communication time-out
            setTimeout(() => {
                if (this.$el && this.$el.readyState !== 4) {
                    this.$el.src = '';
                    callback(new Error('load of html video file has timed out. timeout:' + timeout), this);
                    callback= function () {};
                }
            }, timeout);

            this.$el.load();

            return this;

        }
        isUse() {
        /**
         * Is use. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isUse
         * @return {Boolean}
         */
            super.isUse();
        }
        isPlayback() {
        /**
         * Is playing. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isPlayback
         * @return {Boolean}
         */
            super.isPlayback();
        }
        isStop() {
        /**
         * Is stoped.
         *
         * @memberof HTMLVideo (apply HTMLAudio)
         * @method
         * @name isStop
         * @return {Boolean}
         */
            super.isStop();
        }
        isPause() {
        /**
         * Is paused.
         *
         * @memberof HTMLVideo (apply HTMLAudio)
         * @method
         * @name isPause
         * @return {Boolean}
         */
            super.isPause();
        }
        isLoop() {
        /**
         * Loop flag (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isLoop
         * @return {Interger}
         */
            super.isLoop();
        }
        isParentSprite() {
        /**
         * Is sprite of the parent (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isParentSprite
         * @return {Boolean}
         */
            super.isParentSprite();
        }
        isSprite() {
        /**
         * Is sprite (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isSprite
         * @return {Boolean}
         */
            super.isSprite();
        }
        clearTimerAll() {
        /**
         * Clear all the setTimeout (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name clearTimerAll
         * @return {HTMLAudio}
         */
            super.clearTimerAll();
        }
        clearTimer(name) {
        /**
         * Clear specified setTimeout (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name clearTimer
         * @param {String} name
         * @return {Interger}
         */
            super.clearTimer(name);
        }
        setTimer(name, id) {
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
            super.setTimer(name, id);
        }
        play(resume) {
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
                    fn = () => {
                        var interval = Math.ceil((this.sprite.current.end - _pause) * 1000); // (ms)

                        this.setTimer('play', setTimeout(function () {
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

                    fn = () => {
                        var interval = Math.ceil(this.sprite.current.term * 1000); // (ms)
                        this.setTimer('play', setTimeout(function () {
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
        stop() {
        /**
         * video stop. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name stop
         * @return {HTMLVideo}
         */
            super.stop();
        }
        pause() {
        /**
         * video pause. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name pause
         * @return {HTMLVideo}
         */
            super.pause();
        }
        resume() {
        /**
         * video resume. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name resume
         * @return {HTMLVideo}
         */
            super.resume();
        }
        replay() {
        /**
         * video re-play. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name replay
         * @return {HTMLVideo}
         */
            super.replay();
        }
        volume(v) {
        /**
         * audio change volume. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name volume
         * @return {HTMLVideo}
         */
            super.volume(v);
        }
        _onEnded(e) {
        /**
         * Video.ended events (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
            super._onEnded(e);
        }
        onEnded() {
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
        setLoop(loop) {
        /**
         * Set loop flag (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name setLoop
         * @param {Interger} loop loop flag (Boombox.LOOP_XXX)
         * @return {HTMLVideo}
         */
            super.setLoop(loop);
        }
        power(p) {
        /**
         * Change power on/off (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name power
         * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {HTMLVideo}
         */
            super.power(p);
        }
        setCurrentTime(t) {
        /**
         * Set video.currentTime (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name setCurrentTime
         * @param {Interger} t set value(Video.currentTime)
         * @return {HTMLVideo}
         */
            super.setCurrentTime(t);
        }
        isDisposed() {
        /**
         * Check disposed
         *
         * @memberof HTMLVideo
         * @method
         * @name isDisposed
         */
            super.isDisposed();
        }
        dispose() {
        /**
         * Dispose (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name dispose
         */
            super.dispose();
        }
    }

    //////////////////////////////////
    // WebAudio Class

    class WebAudio extends HTMLAudio {
        constructor(name, parent) {
            super(name, parent);
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
        load(options = {}, callback = none) {
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

            if (options.spritemap) { // Sprite ON
                this.sprite = new Sprite(options.spritemap);
                delete options.spritemap;
            }

            for (let k in options) {
                let v = options[k];
                this.logger.trace('WebAudio attribute:', k, v);
            }


            var http = new XMLHttpRequest();
            http.onload = e => {
                if (e.target.status.toString().charAt(0) === '2') {
                    this.ctx.decodeAudioData(
                        http.response,
                        buffer => {
                            if (!buffer) {
                                this.logger.error('error decode file data: ', options.url);
                                return callback(new Error('error decode file data'), this);
                            }

                            this.buffer = buffer;

                            this.state.loaded = true;

                            /////
                            // audiosprite propagation
                            if (this.isParentSprite()) {
                                for (let k in boombox.pool) {
                                    if (!!~k.indexOf(this.name + SPRITE_SEPARATOR)) {
                                        boombox.pool[k].buffer = buffer; // ref buffer
                                        boombox.pool[k].state.loaded = this.state.loaded;  // not ref copy
                                    }
                                }
                            }


                            return callback(null, this);
                        },
                        () => {
                            return callback(new Error('fail to decode file data'), this);
                        }
                    );
                } else {
                    this.logger.error('fail to load resource: ', options.url);
                    return callback(new Error('fail to load resource'), this);
                }
            };

            //http.timeout = 1;
            var timeout = options.timeout || 15 * 1000;

            // communication time-out
            setTimeout(() => {
                if (http.readyState !== 4) {
                    http.abort();
                    callback(new Error('load of web audio file has timed out. timeout:' + timeout), this);
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
        isUse() {
        /**
         * Is use. (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isUse
         * @return {Boolean}
         */
            super.isUse();
        }
        isPlayback() {
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
        isStop() {
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
        isPause() {
        /**
         * Is paused. (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isPause
         * @return {Boolean}
         */
            super.isPause();
        }
        isLoop() {
        /**
         * Loop flag (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isLoop
         * @return {Interger}
         */
            super.isLoop();
        }
        isParentSprite() {
        /**
         * Is sprite of the parent (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isParentSprite
         * @return {Boolean}
         */
            super.isParentSprite();
        }
        isSprite() {
        /**
         * Is sprite of the parent (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isParentSprite
         * @return {Boolean}
         */
            super.isSprite();
        }
        clearTimerAll() {
        /**
         * Clear all the setTimeout (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name clearTimerAll
         * @return {WebAudio}
         */
            super.clearTimerAll();
        }
        clearTimer(name) {
        /**
         * Clear specified setTimeout (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name clearTimer
         * @param {String} name
         * @return {Interger}
         */
            super.clearTimer(name);
        }
        setTimer(name, id) {
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
            super.setTimer(name, id);
        }
        play(resume) {
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
                    fn = () => {
                        this.setTimer('play', setTimeout(() => {
                            this.stop();
                            this._onEnded(); // fire onended evnet
                        }, interval));

                    };
                }


                this.state.time.pause = undefined;

            } else { // zero

                if (this.isSprite()) {
                    start = this.sprite.current.start;

                    fn = () => {
                        var interval = Math.ceil(this.sprite.current.term * 1000);

                        this.setTimer('play', setTimeout(() => {
                            this.stop();
                            this._onEnded(); // fire onended evnet
                        }, interval));
                    };

                }

            }

            this.logger.debug(type, this.name, 'offset:', start);
            fn();

            var duration = this.buffer.duration - start;
            if (!this.isSprite()) {
                if (this.source.hasOwnProperty('onended')) {
                    this.source.onended = e => {
                        this._onEnded(e);
                    };
                } else {
                    var interval = Math.ceil(duration * 1000);
                    this.setTimer('play', setTimeout(() => {
                        this.stop();
                        this._onEnded();
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
        stop() {
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
        pause() {
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
        resume() {
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
        replay() {
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
        volume(v) {
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
        _onEnded(e) {
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
        onEnded() {
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
        setLoop(loop) {
        /**
         * Set loop flag
         *
         * @memberof WebAudio
         * @method
         * @name setLoop
         * @param {Interger} loop loop flag (boombox.LOOP_XXX)
         * @return {WebAudio}
         */
            if (!this.isUse()) { return this; } // skip!!

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
        power(p) {
        /**
         * Change power on/off (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name power
         * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {WebAudio}
         */
            super.power(p);
        }
        sourceDispose() {
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
        isDisposed() {
        /**
         * Check disposed
         * @memberof WebAudio
         * @method
         * @name isDisposed
         */
            this.logger.trace('check dispose flag', !!this.state);
            return !this.state;
        }
        dispose() {
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
    }

    class Sprite {
        constructor(options, current) {
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
            if (!current) { // parent
                for (let k in this.options) {
                    this.options[k].term = this.options[k].end - this.options[k].start;
                }
            }
        }
        dispose() {
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
    }

    // Building
    boombox.HTMLAudio = HTMLAudio;
    boombox.HTMLVideo = HTMLVideo;
    boombox.WebAudio  = WebAudio;

    if (isRequire) {
        define([], function () {
            return boombox;
        });
    } else {
        w.boombox = boombox;
    }

})(window);
