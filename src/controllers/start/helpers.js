import {Extra} from "telegraf";

export function submitOrderKeyboard(ctx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        m.callbackButton(ctx.i18n.t('yes'), JSON.stringify({a: 'submitOrder', p: true}), false),
        m.callbackButton(ctx.i18n.t('no'), JSON.stringify({a: 'submitOrder', p: false}), false)
      ],
      {}
    )
  );
}

export function settlementKeyboard(ctx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        m.callbackButton(ctx.i18n.t('yes'), JSON.stringify({a: 'selectSettled', p: true}), false),
        m.callbackButton(ctx.i18n.t('no'), JSON.stringify({a: 'selectSettled', p: false}), false)
      ],
      {}
    )
  );
}

export function reasonKeyboard(ctx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        [
          m.callbackButton(ctx.i18n.t('reason.1'), JSON.stringify({a: 'selectReason', p: 1}), false),
          m.callbackButton(ctx.i18n.t('reason.2'), JSON.stringify({a: 'selectReason', p: 2}), false),
          m.callbackButton(ctx.i18n.t('reason.3'), JSON.stringify({a: 'selectReason', p: 3}), false)
        ],
        [
          m.callbackButton(ctx.i18n.t('reason.4'), JSON.stringify({a: 'selectReason', p: 4}), false),
          m.callbackButton(ctx.i18n.t('reason.5'), JSON.stringify({a: 'selectReason', p: 5}), false),
          m.callbackButton(ctx.i18n.t('reason.6'), JSON.stringify({a: 'selectReason', p: 6}), false)
        ]
      ],
      {}
    )
  );
}