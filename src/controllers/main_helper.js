import {Extra} from "telegraf";

export function userJoinToSignalBtn(ctx) {
    return Extra.HTML().markup((m) => {
        return m.inlineKeyboard([
            m.callbackButton(ctx.i18n.t('scenes.listsignal.yes'), JSON.stringify({
                a: 'join',
                p: val
            }), false)
        ], {});
    });
}
