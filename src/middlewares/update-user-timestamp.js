export const updateUserTimestamp = async (ctx, next) => {
    await User.findOneAndUpdate(
        {_id: ctx.from.id},
        {lastActivity: new Date().getTime()},
        {new: true}
    );
    return next();
};
