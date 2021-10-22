import {makeRandomChars, sleep} from '../../util/common';
import {updateLanguage} from '../../util/language';
import {mainKeyboard} from "../../util/menu";
import {getLanguageKeyboard} from "./helpers";

require('dotenv').config();

export async function languageChangeAction (ctx) {
    const langData = JSON.parse(ctx.callbackQuery.data);
    await updateLanguage(ctx, langData.p);
    ctx.deleteMessage();
    let k = mainKeyboard(ctx);
    // k.disable_web_page_preview = true;
    ctx.replyWithHTML(ctx.i18n.t('scenes.start.help'), k);

    /*
    ctx.reply(ctx.i18n.t('scenes.start.h'))
        .then(() => {
            sleep(0.3)
                .then(() => {
                    ctx.replyWithHTML(ctx.i18n.t('scenes.start.bot_description', {fee: process.env.COINVELA_REGULAR_AWARD}), mainKeyboard(ctx));
                });
        });*/
};

export function newUser(ctx) {
    return new Promise(resolve => {
        User.aggregate([
            {"$match": {_id: ctx.from.id.toString()}},
            {"$project": {"channels": 0}}
        ], (err, res) => {
            if (res.length === 0) {
                const now = new Date().getTime();
                makeRandomChars(7)
                    .then(support_id => {
                        const newUser = new User({
                            _id: ctx.from.id,
                            created: now,
                            username: ctx.from.username,
                            name: ctx.from.first_name + ' ' + ctx.from.last_name,
                            lastActivity: now,
                            language: process.env.COINVELA_DEFAULT_LANGUAGE,
                            support_id,
                        });
                        newUser.save()
                            .then((res) => {
                                // console.log(res);
                                ctx.reply('Select your language', getLanguageKeyboard());
                                resolve(true);
                            }).catch(err => {
                            console.log(err)
                        });
                    });
            } else resolve(false);
        });
    });
}
