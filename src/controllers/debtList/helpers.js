import {Extra} from "telegraf";

export function getDebtKeyboard(ctx, idx) {
  let list_len = ctx.session.debts.length;
  const makeNextPrevBtns = (m, btns) => {
    if (idx === list_len - 1) {
      btns.push([
        m.callbackButton(
          ctx.i18n.t("btns.prev"),
          JSON.stringify({
            a: "prevDebt",
            p: idx - 1,
          }),
          false
        ),
      ]);
    } else if (idx === 0) {
      btns.push([
        m.callbackButton(
          ctx.i18n.t("btns.next"),
          JSON.stringify({
            a: "nextDebt",
            p: idx + 1,
          }),
          false
        ),
      ]);
    } else {
      btns.push([
        m.callbackButton(
          ctx.i18n.t("btns.prev"),
          JSON.stringify({
            a: "prevDebt",
            p: idx - 1,
          }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t("btns.next"),
          JSON.stringify({
            a: "nextDebt",
            p: idx + 1,
          }),
          false
        ),
      ]);
    }
    return btns;
  };

  return Extra.HTML().markup((m) => {
    let btns = []
    if (list_len > 1) {
      btns = makeNextPrevBtns(m, btns);
    }
    btns.push([
        m.callbackButton(
          ctx.i18n.t("btns.remove_debt"),
          JSON.stringify({
            a: "askRemoveConfirmation",
            p: idx,
          }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t("btns.settle_debt"),
          JSON.stringify({
            a: "askSettleConfirmation",
            p: idx,
          }),
          false
        ),
      ])
    return m.inlineKeyboard(btns, {});
  });
}

export function confirmDeleteKeyboard(ctx, idx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [[
        m.callbackButton(ctx.i18n.t("btns.sure_delete"), JSON.stringify({
          a: 'removeDebt',
          p: idx
        }), false)],
        [m.callbackButton(ctx.i18n.t("btns.cancel"), JSON.stringify({
          a: 'cancel',
          p: idx
        }), false)]
      ],
      {}
    )
  );
}

export function confirmSettleKeyboard(ctx, idx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [[
        m.callbackButton(ctx.i18n.t("btns.sure_settle"), JSON.stringify({
          a: 'settleDebt',
          p: idx
        }), false)],
        [m.callbackButton(ctx.i18n.t("btns.cancel"), JSON.stringify({
          a: 'cancel',
          p: idx
        }), false)]
      ],
      {}
    )
  );
}