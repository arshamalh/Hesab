import Scene from 'telegraf/scenes/base';
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

const enterDebt = new Scene('enterDebt');

enterDebt.enter(async ctx => {
    ctx.reply(ctx.i18n.t('enter_name'))
    ctx.session.Customer = {}
    ctx.session.next_cmd = "enterName";
    saveToSession(ctx)
});

enterDebt.start(ctx => ctx.scene.enter('enterDebt'))
enterDebt.hears(match('reset'), ctx => ctx.scene.enter('enterDebt'));
enterDebt.hears(match('keyboards.back'), ctx => ctx.scene.enter('start'));

enterDebt.action(/submitOrder/, submitOrder)
enterDebt.action(/selectReason/, selectReason)
enterDebt.action(/selectSettled/, selectSettled)
enterDebt.action(/newDebt/, (ctx) => {
    ctx.answerCbQuery()
    ctx.telegram.editMessageReplyMarkup(ctx.from.id, ctx.session.last_action_message, null)
    ctx.scene.enter('enterDebt')
})

enterDebt.hears(
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

export default enterDebt;
