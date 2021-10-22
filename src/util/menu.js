import {Markup} from "telegraf";

export const mainKeyboard = (ctx) => {
    const back = ctx.i18n.t('keyboards.back');
    let mainKeyboard = Markup.keyboard([[back]])
    return mainKeyboard.resize().extra();
}
