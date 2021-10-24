import Scene from 'telegraf/scenes/base';
import {mainKeyboard} from '../../util/menu';
import {onEnterSession} from "../../util/common";
import {getAllDebts} from "../../util/database";
import {showDebtorKeyboard} from "../debtList/helpers";

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
  }, 10000) // 864e5 for a day period!
}

start.enter((ctx) => {
  onEnterSession(ctx);
  ctx.replyWithHTML(ctx.i18n.t('welcome'), mainKeyboard(ctx))
  startTimer(ctx)
});

export default start;
