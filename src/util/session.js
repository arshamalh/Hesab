export function saveToSession(ctx) {
    let k = ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`;
    r_session.saveSession(k, ctx.session);
}

export function deleteFromSession(ctx, field) {
    delete ctx.session[field];
}
