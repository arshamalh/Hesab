import Scene from 'telegraf/scenes/base';
import {getDebt, nextPrevDebt} from "./actions";
import {getAllDebts} from "../../util/database";
import {match} from "telegraf-i18n";
import {saveToSession} from "../../util/session";

const debtList = new Scene('debtList');

debtList.enter(async ctx => {
  ctx.replyWithHTML(ctx.i18n.t("debt_list")).then(() => {
    getAllDebts(ctx.from.id).then((debts) => {
      ctx.session.debts = debts;
      saveToSession(ctx);
      getDebt(ctx, 0)
    })
  })
});

// Show debtor, delete debtor and others are called in bot.js because sometimes they have global usage
debtList.action(/nextDebt/, nextPrevDebt);
debtList.action(/prevDebt/, nextPrevDebt);

debtList.hears(match("keyboards.back"), async (ctx) => {
  ctx.telegram.editMessageReplyMarkup(
    ctx.from.id,
    ctx.session.last_action_message,
    null
  ).catch(e => {
  });
  ctx.scene.enter("start");
});

debtList.start(ctx => ctx.scene.enter('start'))

export default debtList;
