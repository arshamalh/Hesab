import {Extra} from "telegraf";
import {saveToSession} from "../../util/session";
import {
  confirmDeleteKeyboard, confirmSettleKeyboard,
  getDebtKeyboard
} from "./helpers";
import {removeDebtDB, settleDebtDB} from "../../util/database";

export function getDebt(ctx, idx, update = false) {
  let debts = ctx.session.debts
  let debtsLen = debts.length
  if (debtsLen > 0) {
    if (idx >= debtsLen) idx = debtsLen - 1;
    ctx.session.active_debt_id = debts[idx].id;
    console.log("LAST ID : ", ctx.session.active_debt_id)
    if (update) {
      ctx.editMessageText(
        ctx.i18n.t("debt_list_item", debts[idx]),
        getDebtKeyboard(ctx, idx)
      ).catch((err) => {
        console.log("GetDebts if update = True", err);
      });
    } else {
      ctx.replyWithHTML(
        ctx.i18n.t("debt_list_item", debts[idx]),
        getDebtKeyboard(ctx, idx)
      ).then((d) => {
        ctx.session.last_action_message = d.message_id;
        saveToSession(ctx);
      }).catch((err) => {
        console.log("Error in getDebts: ", err);
      });
    }
  } else {
    ctx.telegram.deleteMessage(ctx.from.id, ctx.session.last_action_message);
    ctx.reply(ctx.i18n.t("errors.no_debt"));
  }
}

export function askRemoveConfirmation(ctx) {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  ctx.editMessageText(
    ctx.i18n.t("debt_list_item", ctx.session.debts[idx]),
    confirmDeleteKeyboard(ctx, idx)
  );
}

export function removeDebt(ctx) {
  return new Promise((resolve, reject) => {
    let debtId = ctx.session.active_debt_id;
    ctx.session.debts = ctx.session.debts.filter(
      (debt) => debt.id !== debtId
    );
    removeDebtDB(debtId).then(r => {
      saveToSession(ctx);
      resolve(true);
    })
  });
}

export function askSettleConfirmation(ctx) {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  ctx.editMessageText(
    ctx.i18n.t("debt_list_item", ctx.session.debts[idx]),
    confirmSettleKeyboard(ctx, idx)
  );
}

export function settleDebt(ctx) {
  return new Promise((resolve, reject) => {
    let debtId = ctx.session.active_debt_id;
    ctx.session.debts = ctx.session.debts.filter(
      (debt) => debt.id !== debtId
    );
    settleDebtDB(debtId).then(r => {
      saveToSession(ctx);
      resolve(true);
    })
  });
}

