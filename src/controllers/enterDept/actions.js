import {Extra} from "telegraf";
import {newUser} from "../../util/database";
import {saveToSession} from "../../util/session";
import {newDebtKeyboard, nonePhoneKeyboard, reasonKeyboard, submitOrderKeyboard} from "./helpers";
import {digitsFaToEn} from "@persian-tools/persian-tools";


export function enterName(ctx, val, next_cmd) {
  // To prevent confusion: In enter name function,
  // we have gotten the name and we want to tell user to enter next
  ctx.replyWithHTML(ctx.i18n.t('enter_phone'), nonePhoneKeyboard(ctx))
    .then(d => {
      ctx.session.Customer['name'] = val;
      ctx.session.next_cmd = next_cmd;
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
}

export function enterPhone(ctx, val, next_cmd) {
  val = digitsFaToEn(val)
  val = val.replace("+98", "")
  if (!isNaN(val)) {
    ctx.replyWithHTML(ctx.i18n.t('enter_reason'), reasonKeyboard(ctx))
      .then(d => {
        ctx.session.Customer['phone'] = val;
        ctx.session.next_cmd = next_cmd
        ctx.session.last_action_message = d.message_id;
        saveToSession(ctx);
      });
  } else {
    ctx.replyWithHTML(ctx.i18n.t('errors.phone_number'))
  }
}

export function nonePhone(ctx) {
  ctx.answerCbQuery(null)
  ctx.telegram.deleteMessage(ctx.from.id, ctx.session.last_action_message).then(() => {
    ctx.replyWithHTML(ctx.i18n.t('enter_reason'), reasonKeyboard(ctx))
      .then(d => {
        ctx.session.Customer['phone'] = 0;
        ctx.session.next_cmd = "enterReason"
        ctx.session.last_action_message = d.message_id;
        saveToSession(ctx);
      });
  })
}

export function enterReason(ctx, val, next_cmd) {
  ctx.replyWithHTML(ctx.i18n.t('enter_amount'))
    .then(d => {
      ctx.session.Customer['reason'] = val;
      ctx.session.next_cmd = next_cmd;
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
}

export function selectReason(ctx) {
  let reason = JSON.parse(ctx.callbackQuery.data).p;
  reason = ctx.i18n.t('reason.' + reason)
  ctx.answerCbQuery()
  ctx.telegram.editMessageText(
    ctx.from.id,
    ctx.session.last_action_message,
    null,
    ctx.i18n.t("reason_selected", {reason}),
    Extra.HTML()).then(() => {
    ctx.replyWithHTML(ctx.i18n.t('enter_amount')).then(d => {
      ctx.session.Customer['reason'] = reason;
      ctx.session.next_cmd = "enterAmount"
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
  })
}

export function enterAmount(ctx, val) {
  val = digitsFaToEn(val)
  if (!isNaN(val)) {
    ctx.session.Customer['amount'] = val;
    console.table(ctx.session.Customer)
    ctx.replyWithHTML(ctx.i18n.t('preview', ctx.session.Customer), submitOrderKeyboard(ctx))
      .then(d => {
        ctx.session.last_action_message = d.message_id;
        saveToSession(ctx);
      }).catch((e) => {
      console.log(e)
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('errors.wrong_amount'))
  }
}

export function submitOrder(ctx) {
  const cond = JSON.parse(ctx.callbackQuery.data).p;
  if (cond) {
    let {name, phone, reason, amount} = ctx.session.Customer
    newUser(name, phone, reason, amount, ctx.from.id, (result) => {
      if (result) {
        ctx.answerCbQuery(ctx.i18n.t("successful_submit", {id: result}))
        ctx.telegram.editMessageReplyMarkup(ctx.from.id, ctx.session.last_action_message, null).then(() => {
          ctx.replyWithHTML(ctx.i18n.t("successful_submit", {id: result}), newDebtKeyboard(ctx)).then(d => {
            ctx.session.last_action_message = d.message_id;
            ctx.session.next_cmd = "enterName"
            ctx.session.Customer = {}
            saveToSession(ctx);
          })
        })
      } else {
        ctx.telegram.editMessageReplyMarkup(ctx.from.id, ctx.session.last_action_message, null).then(() => {
          ctx.replyWithHTML(ctx.i18n.t("failed_submit"))
        })
      }
    })
  } else {
    // TODO: if the entered data is wrong any way...
    // Show some buttons each showing one part to correct (name, phone, reason, ...)
  }
}
