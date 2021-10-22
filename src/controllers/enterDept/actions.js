import {Extra} from "telegraf";
import {newUser} from "../../util/database";
import {saveToSession} from "../../util/session";
import {
  reasonKeyboard,
  submitOrderKeyboard,
  settlementKeyboard,
  newDebtKeyboard
} from "./helpers";

export function enterName(ctx, val, next_cmd) {
  ctx.replyWithHTML(ctx.i18n.t('enter_fof_name')) /// in enter name function, we have gotten the name and we want to tell user to enter next
    .then(d => {
      ctx.session.Customer['name'] = val;
      ctx.session.next_cmd = next_cmd;
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
}

export function enterFofName(ctx, val, next_cmd) {
  ctx.replyWithHTML(ctx.i18n.t('enter_phone'))
    .then(d => {
      ctx.session.Customer['fofName'] = val;
      ctx.session.next_cmd = next_cmd
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
}

export function enterPhone(ctx, val, next_cmd) {
  val = val.replace("+98", "")
  if (!isNaN(val) && (val.length === 10 || val.length === 11)) {
    ctx.replyWithHTML(ctx.i18n.t('enter_reason'), reasonKeyboard(ctx))
      .then(d => {
        ctx.session.Customer['phoneNumber'] = val;
        ctx.session.next_cmd = next_cmd
        ctx.session.last_action_message = d.message_id;
        saveToSession(ctx);
      });
  } else {
    ctx.replyWithHTML(ctx.i18n.t('errors.phone_number'))
  }
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

export function enterAmount(ctx, val, next_cmd) {
  if (!isNaN(val)) {
    ctx.replyWithHTML(ctx.i18n.t('enter_settled'), settlementKeyboard(ctx))
      .then(d => {
        ctx.session.Customer['amount'] = val;
        ctx.session.next_cmd = next_cmd
        ctx.session.last_action_message = d.message_id;
        saveToSession(ctx);
      }).catch((e) => {
      console.log(e)
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('errors.wrong_amount'))
  }
}

export function enterSettled(ctx, val) {
  ctx.session.Customer['settled'] = val;
  console.log(ctx.session.Customer)
  ctx.replyWithHTML(ctx.i18n.t('preview', ctx.session.Customer), submitOrderKeyboard(ctx))
    .then(d => {
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
}

export function selectSettled(ctx) {
  let st = JSON.parse(ctx.callbackQuery.data).p;
  st = st ? ctx.i18n.t('btns.yes') : ctx.i18n.t('btns.no')
  ctx.session.Customer['settled'] = st;
  ctx.answerCbQuery()
  ctx.telegram.editMessageText(
    ctx.from.id,
    ctx.session.last_action_message,
    null,
    ctx.i18n.t("settled_state", {st}),
    Extra.HTML()).then(() => {
    ctx.replyWithHTML(ctx.i18n.t('preview', ctx.session.Customer), submitOrderKeyboard(ctx)).then(d => {
      ctx.session.last_action_message = d.message_id;
      saveToSession(ctx);
    });
  })
}

export function submitOrder(ctx) {
  const cond = JSON.parse(ctx.callbackQuery.data).p;
  if (cond) {
    let {name, fofName, phoneNumber, reason, amount, settled} = ctx.session.Customer
    newUser(name, fofName, phoneNumber, reason, amount, settled, (result) => {
      ctx.answerCbQuery()
      if (result) {
        ctx.telegram.editMessageReplyMarkup(ctx.from.id, ctx.session.last_action_message, null).then(() => {
          ctx.replyWithHTML(ctx.i18n.t("successful_submit", {id: result}), newDebtKeyboard(ctx)).then(d => {
            ctx.session.last_action_message = d.message_id;
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
