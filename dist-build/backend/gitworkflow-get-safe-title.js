"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
async function start() {
    const body = process.env.TITLE.trim();
    const res = (body.split(']')[1] || '')
        .replace(/[\\\'\"\.\-\(\)]/g, '')
        .split('\r')[0]
        .split('\n')[0];
    console.log(res || 'unknown');
}
if (!process.env.TEST) {
    start();
}
