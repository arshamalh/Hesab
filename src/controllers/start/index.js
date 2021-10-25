import Scene from 'telegraf/scenes/base';
import {mainKeyboard} from '../../util/menu';
import {onEnterSession} from "../../util/common";
import {getAllDebts, newVendor} from "../../util/database";
import {showDebtorKeyboard} from "../debtList/helpers";
import {saveToSession} from "../../util/session";
import {match} from "telegraf-i18n";

const start = new Scene('start');

function startTimer(ctx) {
  setInterval(() => {
    let td;
    let timeDifference = function (time) {
      // How many days passed of particular debts
      return (Date.now() - Date.parse(time)) / 864e5
    }
    getAllDebts((debts) => {
      for (let dbt of debts) {
        td = timeDifference(dbt.created_at)
        if (td > 1) {
          ctx.replyWithHTML(
            ctx.i18n.t('debtor_timer', {name: dbt.name, days: Math.round(td)}),
            showDebtorKeyboard(ctx, dbt.id))
        }
      }
    })
  }, 10000) // 6e8 for 7 day period!
}

start.enter((ctx) => {
  if (ctx.session.uid !== ctx.from.id) {
    ctx.replyWithHTML(ctx.i18n.t('welcome'), mainKeyboard(ctx)).then(() => {
      ctx.replyWithHTML(ctx.i18n.t('vendor.enter_name'))
      ctx.session.uid = ctx.from.id
      ctx.session.next_cmd = "vEnterName";
      saveToSession(ctx)
    })
  } else {
    ctx.replyWithHTML(ctx.i18n.t('start_menu'), mainKeyboard(ctx))
  }
  startTimer(ctx)
});

start.start(ctx => {
  onEnterSession(ctx)
  ctx.scene.enter('start')
})

start.hears(match('keyboards.back'), async ctx => ctx.scene.enter('start'));
start.hears(match('keyboards.enter_debt'), async ctx => ctx.scene.enter('enterDebt'));
start.hears(match('keyboards.debt_list'), async ctx => ctx.scene.enter('debtList'));

start.hears(/(.+)/, async (ctx) => {
  return new Promise(resolve => {
    if (ctx.session['next_cmd'] === 'vEnterName') {
      ctx.replyWithHTML(ctx.i18n.t('enter_phone'))
        .then(() => {
          ctx.session.vendor = ctx.message.text;
          ctx.session.next_cmd = 'vEnterPhone';
          saveToSession(ctx)
        });
    } else if (ctx.session['next_cmd'] === 'vEnterPhone') {
      newVendor(ctx.from.id, ctx.from.username, ctx.session.vendor, ctx.message.text, (res) => {
        if (res) ctx.replyWithHTML(ctx.i18n.t('vendor.thank_you'))
      })
    }
    resolve(true);
  });
})

export default start;
