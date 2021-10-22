import Scene from 'telegraf/scenes/base';
import {saveToSession} from "../../util/session";
import {
  askRemoveConfirmation, askSettleConfirmation,
  getDebt, removeDebt, settleDebt
} from "./actions";
import {makeDebtList} from "../../util/database";
import {match} from "telegraf-i18n";

const debtList = new Scene('debtList');

debtList.enter(async ctx => {
  ctx.replyWithHTML(ctx.i18n.t("debt_list")).then(() => {
    makeDebtList(ctx).then(() => {
      getDebt(ctx, 0)
    })
  })
});

debtList.action(/askRemoveConfirmation/, askRemoveConfirmation)
debtList.action(/askSettleConfirmation/, askSettleConfirmation)

debtList.action(/nextDebt/, (ctx) => {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  getDebt(ctx, idx, true);
});

debtList.action(/prevDebt/, (ctx) => {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  getDebt(ctx, idx, true);
});

debtList.action(/cancel/, (ctx) => {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  getDebt(ctx, idx, true);
})

debtList.action(/removeDebt/, (ctx) => {
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  removeDebt(ctx).then(() => {
    ctx.answerCbQuery(ctx.i18n.t("btns.remove_debt"));
    getDebt(ctx, idx, true);
  });
});

debtList.action(/settleDebt/, (ctx) => {
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  settleDebt(ctx).then(() => {
    ctx.answerCbQuery(ctx.i18n.t("btns.settle_debt"));
    getDebt(ctx, idx, true);
  });
});

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
