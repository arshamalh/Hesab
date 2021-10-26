import Scene from 'telegraf/scenes/base';
import {saveToSession} from "../../util/session";
import {enterAmount, enterName, enterPhone, enterReason, nonePhone, selectReason, submitOrder} from "./actions";
import {match} from "telegraf-i18n";
import {backKeyboard} from "../../util/menu";

const enterDebt = new Scene('enterDebt');

enterDebt.enter(async ctx => {
    ctx.replyWithHTML(ctx.i18n.t('enter_name'), backKeyboard(ctx))
    ctx.session.Customer = {}
    ctx.session.next_cmd = "enterName";
    saveToSession(ctx)
});

enterDebt.start(ctx => ctx.scene.enter('enterDebt'))
enterDebt.hears(match('reset'), ctx => ctx.scene.enter('enterDebt'));
enterDebt.hears(match('keyboards.back'), ctx => ctx.scene.enter('start'));

enterDebt.action(/submitOrder/, submitOrder)
enterDebt.action(/selectReason/, selectReason)
enterDebt.action(/nonePhone/, nonePhone)
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
                    enterName(ctx, val, "enterPhone");
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
                    enterAmount(ctx, val);
                    break
                }
                default:
                    break;
            }
            resolve(true);
        })
    }
);

export default enterDebt;
