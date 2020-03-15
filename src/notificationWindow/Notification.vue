<template>
    <div class="container">
        <div class="grid-container">
            <div class="loader"
                 :style="{width:progress+'%'}"></div>
        </div>
        <div class="grid-container">
            <div class="items">
                <img width="60" height="60" alt="message-icon"
                     :src="'../public/icons/'+icon">
                <h2 class="text">{{text}}</h2>
            </div>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron');
    import {TimerService} from '../services/TimerService';

    export default {
        name   : "Notification",
        data   : function () {
            return {
                text             : 'Time for 5 minute break',
                icon             : 'chronometer.png',
                progress         : 0,
                displayForSeconds: 0,
                shown            : false
            }
        },
        methods: {
            increaseProgress() {
                this.progress += 100 / this.displayForSeconds;
            }
        },
        created() {
            ipcRenderer.on('show-data', (event, arg) => {
                this.displayForSeconds = arg.displayForSeconds;
                this.progress = 100 / arg.displayForSeconds;
                this.text = arg.text;
                this.icon = arg.icon;
                TimerService.setTimer(1, this.increaseProgress, true);
            });
            ipcRenderer.on('hide', (event, arg) => {
                TimerService.removeTimer(this.increaseProgress);
                this.progress = 0;
            });
        },
        destroyed() {
            ipcRenderer.removeAllListeners('show-data');
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

    .loader {
        height: 3px;
        background: rgba(0, 0, 0, 0.3);
        transition: width 1s;
    }
</style>