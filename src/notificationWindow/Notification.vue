<template>
    <transition name="fade">
        <div class="container" v-if="shown">
            <div class="grid-container">
                <div class="loader" :class="{'loader-active': loaderActive}"
                     :style="{width:progress+'%'}"></div>
            </div>
            <div class="grid-container">
                <div class="items">
                    <img width="60" height="60" alt="message-icon" v-if="images(icon)"
                         :src="images(icon).default">
                    <h2 class="text">{{text}}</h2>
                </div>
            </div>
            <collapse-transition :delay="300">
                <div class="grid-container" v-if="showPause">
                    <button class="pause-button" @click="pause">Pause for 5 minutes</button>
                </div>
            </collapse-transition>
        </div>
    </transition>
</template>

<script>
    import {MediaService} from "../services/MediaService";

    const {ipcRenderer} = require('electron');
    import {TimerService} from '../services/TimerService';
    import {CollapseTransition} from 'vue2-transitions';

    export default {
        name      : "Notification",
        components: [
            CollapseTransition
        ],
        data      : function () {
            return {
                text             : 'Time for 5 minute break',
                icon             : 'chronometer.png',
                progress         : 0,
                displayForSeconds: 0,
                shown            : false,
                loaderActive     : false,
                showPause        : false,
                images           : MediaService.getImage
            }
        },
        methods   : {
            increaseProgress() {
                this.progress += 100 / this.displayForSeconds;
            },
            pause() {
                if (this.sender)
                {
                    this.sender.send('pause');
                }
                this.showPause = false;
            }
        },
        created() {
            ipcRenderer.on('show-data', (event, arg) => {
                this.displayForSeconds = arg.displayForSeconds;
                this.progress = 100 / arg.displayForSeconds;
                this.sender = event.sender;
                if (arg.showPause)
                {
                    TimerService.setTimer(0.5, () =>
                        this.shown ? this.showPause = true : undefined
                    );
                    TimerService.setTimer(parseInt(this.displayForSeconds / 3), () =>
                        this.shown ? this.showPause = false : undefined
                    );
                }
                this.text = arg.text;
                this.icon = arg.icon;
                this.shown = true;
                this.loaderActive = true;
                TimerService.setTimer(1, this.increaseProgress, true);
            });
            ipcRenderer.on('before-hide', () => {
                this.shown = false;
            });
            ipcRenderer.on('hide', (event, arg) => {
                this.loaderActive = false;
                this.showPause = false;
                TimerService.removeTimer(this.increaseProgress);
                this.progress = 0;
            });
        },
        destroyed() {
            ipcRenderer.removeAllListeners('show-data');
            ipcRenderer.removeAllListeners('before-hide');
            ipcRenderer.removeAllListeners('hide');
        }
    }
</script>
<style>
    /* http://meyerweb.com/eric/tools/css/reset/
     v2.0 | 20110126
     License: none (public domain)
  */
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }

    body {
        line-height: 1;
        background: rgba(0, 0, 0, 0);
        margin: 5px;
    }

    ol, ul {
        list-style: none;
    }

    blockquote, q {
        quotes: none;
    }

    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .grid-container {
        display: flex;
        flex-direction: row;
    }

    h2.text {
        font-size: 20px;
        text-align: center;
        display: inline-block;
        margin: auto;
        padding-left: 20px;
    }

    .items {
        display: flex;
        flex-flow: row;
        padding: 15px;
    }

    .container {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: Arial, Helvetica, sans-serif;
        /*max-height: 100px;*/
        min-height: 100px;
        width: 400px;
        vertical-align: middle;
        border-radius: 10px;
        -moz-border-radius: 10px;
        -webkit-border-radius: 10px;
        border: 0px solid #2B1A2B;
        background: rgba(255, 255, 255, 0.8);
        margin: auto;
        -webkit-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.46);
        -moz-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.46);
        box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.46);
    }

    .loader-active {
        transition: width 1s;
    }

    .loader {
        height: 3px;
        background: rgba(0, 0, 0, 0.3);
    }

    .fade-leave-active {
        transition: opacity 1s ease-out;
    }

    .fade-enter-active {
        transition: opacity 1s ease-in;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .pause-button {
        border: none;
        width: 100%;
        height: 30px;
        background: #dddddd;
        cursor: pointer;
        font-size: 0.7em;
    }

    .pause-button:hover {
        background: #c2c2c2
    }

    .pause-button:active {
        background: #adadad
    }

    .pause-button:focus {
        outline: 0;
    }
</style>