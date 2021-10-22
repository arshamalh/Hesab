require('@babel/register');
import "core-js/stable";
import "regenerator-runtime/runtime";
import Telegraf, {ContextMessageUpdate, Extra, Markup} from 'telegraf';
import TelegrafI18n, {match} from 'telegraf-i18n';
import {DataBaseInit} from "./util/database"

const RedisSession = require('telegraf-session-redis');
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import path from "path";
import startScene from './controllers/start';

import {getUserInfo} from './middlewares/user-info';

require('dotenv').config();

global.bot = new Telegraf(process.env.TELEGRAM_TOKEN);
global.r_session = new RedisSession({
    store: {
        host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
        port: process.env.TELEGRAM_SESSION_PORT || 6379
    }
});
DataBaseInit()
const stage = new Stage([
    startScene
]);
const i18n = new TelegrafI18n({
    defaultLanguage: 'fa',
    directory: path.resolve(__dirname, './../locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session'
});
bot.use(r_session);
bot.use(i18n.middleware());
bot.use(stage.middleware());
bot.use((ctx, next) => {
    if ("updateType" in ctx) {
        if (ctx.updateType === "channel_post")
            return;
    }
    return next();
});
bot.use(getUserInfo);


bot.start((ctx) => {
    ctx.session.init = true;
    ctx.scene.enter('start')
});

bot.hears(
    match('keyboards.back'),
    async (ctx) => {
        ctx.scene.enter('start');
    }
);


bot.catch((error) => {
});
bot.launch();
