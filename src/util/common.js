import {saveToSession} from "./session";
require('dotenv').config();
export function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export function onEnterSession(ctx) {
    try {
        ctx.session = {
            __language_code: ctx.session.__language_code,
            language: ctx.session.language,
            __scenes: ctx.session.__scenes,
            init: ctx.session.init
        };
        saveToSession(ctx);
    } catch (e) {
    }
}