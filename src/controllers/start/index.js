import Scene from 'telegraf/scenes/base';
import {onEnterSession} from "../../util/common";
import {saveToSession} from "../../util/session";
import {
    enterName,
    enterFofName,
    enterPhone,
    enterReason,
    selectReason,
    enterAmount,
    enterSettled,
    selectSettled,
    submitOrder
} from "./actions";
import {match} from "telegraf-i18n";

const start = new Scene('start');

start.enter(async ctx => {
    onEnterSession(ctx)
    ctx.replyWithHTML(ctx.i18n.t('welcome')).then(() => {
        ctx.reply(ctx.i18n.t('enter_name'))
        ctx.session.Customer = {}
        ctx.session.next_cmd = "enterName";
        saveToSession(ctx)
    });
});

start.start(async ctx => {
    ctx.reply(ctx.i18n.t('enter_name'))
    ctx.session.Customer = {}
    ctx.session.next_cmd = "enterName";
    saveToSession(ctx)
})

start.hears(match('reset'), async (ctx) => {
    ctx.scene.enter('start');
});

start.action(/submitOrder/, submitOrder)
start.action(/selectReason/, selectReason)
start.action(/selectSettled/, selectSettled)


start.hears(
    /(.+)/,
    async (ctx) => {
        console.log(ctx.message.text)
        return new Promise(resolve => {
            let val = ctx.message.text;
            console.log("SS:", ctx.session['next_cmd'])
            switch (ctx.session['next_cmd']) {
                case "enterName":
                    enterName(ctx, val, "enterFofName");
                    break;
                case "enterFofName":
                    enterFofName(ctx, val, "enterPhone");
                    break;

                case "enterPhone": {
                    enterPhone(ctx, val, "enterReason");
                    break;
                }
                case "enterReason": {
                    enterReason(ctx, val, "enterAmount");
                    break;
                }
                case "enterAmount": {
                    enterAmount(ctx, val, "enterSettled");
                    break
                }
                case "enterSettled": {
                    enterSettled(ctx, val);
                    break;
                }
                default:
                    break;
            }
            resolve(true);
        })
    }
);

export default start;
