import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import {mainKeyboard} from '../../util/menu';
import {onEnterSession} from "../../util/common";
import {match} from "telegraf-i18n";

const start = new Scene('start');

start.enter((ctx) => {
    onEnterSession(ctx);
    ctx.replyWithHTML(ctx.i18n.t('welcome'), mainKeyboard(ctx))
});

export default start;
