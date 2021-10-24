import {saveToSession} from "../../util/session";
import {
  confirmDeleteKeyboard, confirmSettleKeyboard,
  getDebtKeyboard
} from "./helpers";
import {makeDebtList, removeDebtDB, settleDebtDB} from "../../util/database";
import {timeAgo, digitsEnToFa} from "@persian-tools/persian-tools";

const moment = require('jalali-moment');


//

function showDebtDetails(ctx, debt) {
  debt = {...debt} // Use this method to disconnect from same reference
  if (!!debt.settled_at) {
    debt.settled_at = moment(debt.settled_at, 'YYYY-M-D HH:mm').locale('fa').format('YYYY/M/D HH:mm')
    debt.settled_at = timeAgo(debt.settled_at) + " (" + digitsEnToFa(debt.settled_at.slice(0, 8)) + ")"
  } else {
    debt.settled_at = "---"
  }
  debt.created_at = moment(debt.created_at, 'YYYY-M-D HH:mm').locale('fa').format('YYYY/M/D HH:mm:ss')
  debt.created_at = timeAgo(debt.created_at) + " (" + digitsEnToFa(debt.created_at.slice(0, 8)) + ")"
  debt.phone = digitsEnToFa(debt.phone)
  return ctx.i18n.t("debt_list_item", debt)
}

export function getDebt(ctx, idx, update = false) {
  let debts = ctx.session.debts
  let debtsLen = debts.length
  if (debtsLen > 0) {
    if (idx >= debtsLen) idx = debtsLen - 1;
    ctx.session.active_debt_id = debts[idx].id;
    console.log("LAST ID : ", ctx.session.active_debt_id)
    if (update) {
      ctx.editMessageText(
        showDebtDetails(ctx, debts[idx]),
        getDebtKeyboard(ctx, idx)
      ).catch((err) => {
        console.log("GetDebts if update = True", err);
      });
    } else {
      ctx.replyWithHTML(
        showDebtDetails(ctx, debts[idx]),
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
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  let debtId = ctx.session.active_debt_id;
  ctx.session.debts = ctx.session.debts.filter(
    (debt) => debt.id !== debtId
  );
  removeDebtDB(debtId).then(r => {
    saveToSession(ctx);
    ctx.answerCbQuery(ctx.i18n.t("btns.remove_debt"));
    getDebt(ctx, idx, true);
  })
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
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
    let debtId = ctx.session.active_debt_id;
    ctx.session.debts = ctx.session.debts.filter(
      (debt) => debt.id !== debtId
    );
    settleDebtDB(debtId).then(r => {
      saveToSession(ctx);
      ctx.answerCbQuery(ctx.i18n.t("btns.settle_debt"));
      getDebt(ctx, idx, true);
  });
}

export function nextPrevDebt(ctx) {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let idx = d.p;
  getDebt(ctx, idx, true);
}

export function showDebtor(ctx) {
  ctx.answerCbQuery(null);
  const d = JSON.parse(ctx.callbackQuery.data);
  let debtor_id = d.p;
  makeDebtList(ctx, debtor_id).then(() => {
    getDebt(ctx, 0)
  })
}