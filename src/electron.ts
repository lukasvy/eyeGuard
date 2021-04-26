'use strict';

const {app, BrowserWindow, Tray, Menu, powerMonitor, nativeImage} = require('electron');
import {AppService} from './services/AppService';

const path = require("path");
const process = require("process");

let tray = null;
let myWindow = null;
let quitCalled = false;

const gotTheLock = app.requestSingleInstanceLock();

const [windowWidth, windowHeight] = [800, 680];

function createWindow() {
    let win = new BrowserWindow({
        width         : windowWidth,
        height        : windowHeight,
        show          : false,
        maximizable   : false,
        resizable     : false,
        center        : true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon          : path.join(__dirname, '..', 'public', 'icons', 'chronometer256x256.ico')
    });

    // win.webContents.openDevTools();

    win.removeMenu();
    myWindow = win;
    win.loadFile(path.join(__dirname, 'index.html'));
    myWindow.on('minimize', function (event) {
        event.preventDefault();
        myWindow.hide();
        AppService.start(app, myWindow);
    });

    myWindow.on('show', function (event) {
        win.setBounds({width: windowWidth, height: windowHeight});
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

    function buildMenu() {
        return Menu.buildFromTemplate([
            {
                label: 'Settings', type: 'normal', click: () => {
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
        ])
    }

    const contextMenu = buildMenu();
    // win.openDevTools();
    tray = new Tray(nativeImage.createFromPath(
        path.join(__dirname, '..', 'public', 'icons', 'chronometer.png'))
    );
    tray.setToolTip('Eye Guard');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        AppService.stop();
        win.show();
    });

    AppService.start(app, myWindow, tray);

    powerMonitor.on('unlock-screen', () => {
        AppService.start();
    });

    powerMonitor.on('lock-screen', () => {
        AppService.stop();
    });
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
