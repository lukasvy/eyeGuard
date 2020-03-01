'use strict';

const {app, BrowserWindow, Tray, Menu} = require('electron');
import {AppService} from './services/AppService';

let tray = null;
let myWindow = null;
let quitCalled = false;

const gotTheLock = app.requestSingleInstanceLock();

function createWindow() {
    let win = new BrowserWindow({
        width         : 300,
        height        : 250,
        show          : false,
        maximizable   : false,
        center        : true,
        webPreferences: {
            nodeIntegration: true
        },
        icon          : __dirname + '/public/icons/chronometer256x256.ico'
    });
    win.removeMenu();
    myWindow = win;
    win.loadFile('index.html');
    myWindow.on('minimize', function (event) {
        event.preventDefault();
        myWindow.hide();
        AppService.start(app, myWindow);
    });

    myWindow.on('show', function (event) {
        AppService.stop();
    });

    myWindow.on('close', function (event) {
        if (!quitCalled) {
            if (!app.isQuiting) {
                event.preventDefault();
                myWindow.hide();
            }
            AppService.start(app, myWindow);
            return false;
        } else {
            return true;
        }
    });

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'About', type: 'normal', click: () => {
                AppService.stop();
                win.show();
            }
        },
        {type: 'separator'},
        {
            label: 'Quit', type: 'normal', click: () => {
                quitCalled = true;
                AppService.stop();
                app.quit();
            }
        },
    ]);
    tray = new Tray('./public/icons/chronometer.png');
    tray.setToolTip('Eye Guard');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        AppService.stop();
        win.show();
    });
    AppService.start(app, myWindow);
}

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore();
            myWindow.focus();
        }
    });
    app.on('ready', createWindow);
}