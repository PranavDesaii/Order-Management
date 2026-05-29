const validateOrder = (req, res, next) => {
  const { store_id, items, total_amount } = req.body;

  if (!store_id || typeof store_id !== 'number') {
    return res.status(400).json({ error: 'store_id is required and must be a number' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }

  for (const item of items) {
    if (!item.item_id || !item.qty || typeof item.qty !== 'number') {
      return res.status(400).json({ error: 'Each item must have item_id and qty as number' });
    }
  }

  if (!total_amount || typeof total_amount !== 'number') {
    return res.status(400).json({ error: 'total_amount is required and must be a number' });
  }

  next();
};

const validateStatus = (req, res, next) => {
  const { status } = req.body;
  const allowed = ['PLACED', 'PREPARING', 'COMPLETED'];

  if (!status || !allowed.includes(status)) {
    return res.status(400).json({ error: 'status must be PLACED, PREPARING or COMPLETED' });
  }

  next();
};

module.exports = { validateOrder, validateStatus };