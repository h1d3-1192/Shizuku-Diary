const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const live2dPath = path.resolve(__dirname, '../public/scripts/live2d.min.js');
const live2dContent = fs.readFileSync(live2dPath, 'utf-8');

const dom = new JSDOM(`<!DOCTYPE html><html><head><script>${live2dContent}</script></head><body></body></html>`, {
  runScripts: 'dangerously',
  url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.HTMLElement = dom.window.HTMLElement;
global.requestAnimationFrame = dom.window.requestAnimationFrame;
global.cancelAnimationFrame = dom.window.cancelAnimationFrame;
