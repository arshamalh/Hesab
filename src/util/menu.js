import {Markup} from "telegraf";

export const mainKeyboard = (ctx) => {
    const back = ctx.i18n.t('keyboards.back');
    const enter_debt = ctx.i18n.t('keyboards.enter_debt');
    const debt_list = ctx.i18n.t('keyboards.debt_list');
    let mainKeyboard = Markup.keyboard([[debt_list, enter_debt], [back]])
    return mainKeyboard.resize().extra();
}

export const backKeyboard = (ctx) => {
    return Markup.keyboard([[ctx.i18n.t('keyboards.back')]]).resize().extra();
}