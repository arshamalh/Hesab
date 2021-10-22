import {saveToSession} from "../util/session";

export const getUserInfo = async (ctx, next) => {
    ctx.session.language = 'fa';
    ctx.session.__language_code = 'fa';
    ctx.i18n.locale('fa');
    saveToSession(ctx);
    return next();
};
