require('@babel/register');
import debtList from "./controllers/debtList";
import debtListScene from "./controllers/debtList";
import path from "path";
import "core-js/stable";
import "regenerator-runtime/runtime";
import Telegraf from 'telegraf';
import TelegrafI18n, {match} from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import startScene from "./controllers/start";
import enterDebtScene from './controllers/enterDept';
import {DataBaseInit} from "./util/database"
import {getUserInfo} from './middlewares/user-info';
import {askRemoveConfirmation, askSettleConfirmation, nextPrevDebt, removeDebt, settleDebt, showDebtor} from "./controllers/debtList/actions";

const RedisSession = require('telegraf-session-redis');
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
    startScene, enterDebtScene, debtListScene
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

bot.hears(match('keyboards.back'), async ctx => ctx.scene.enter('start'));
bot.hears(match('keyboards.enter_debt'), async ctx => ctx.scene.enter('enterDebt'));
bot.hears(match('keyboards.debt_list'), async ctx => ctx.scene.enter('debtList'));

// Global actions
/*
    These actions actually are related to alert system,
    so it could be possible to call them from anywhere
*/
bot.action(/askRemoveConfirmation/, askRemoveConfirmation)
bot.action(/askSettleConfirmation/, askSettleConfirmation)
bot.action(/showDebtor/, showDebtor);
bot.action(/removeDebt/, removeDebt);
bot.action(/settleDebt/, settleDebt);
bot.action(/cancel/, nextPrevDebt);

bot.catch((err) => {
    console.log("There is in bot.js", err)
});

bot.launch();
