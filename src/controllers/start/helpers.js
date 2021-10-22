import {Extra} from 'telegraf';
import languages from './../../../../languages';

export function getLanguageKeyboard() {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            languages.map(l => {
                return m.callbackButton(l.name, JSON.stringify({a: 'languageChange', p: l.code}), false)
            }),
            {}
        )
    );
}
