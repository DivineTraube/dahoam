exports.call = async function(db, data, req) {
    const userId = data.id;
    const cart = await db.Cart.load(userId) || new db.Cart({ elems: [] });
    await new Promise(res => setTimeout(res, 5000));

    return ["1", "2", "3", "4", "5", "6"].filter(elem => !cart.elems.includes(elem));
};