const pool = require('../config/db');

// POST /orders
const createOrder = async (req, res) => {
  const { store_id, items, total_amount } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO orders (store_id, total_amount, status) VALUES (?, ?, ?)',
      [store_id, total_amount, 'PLACED']
    );

    const orderId = result.insertId;

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, item_id, qty) VALUES (?, ?, ?)',
        [orderId, item.item_id, item.qty]
      );
    }

    await conn.commit();

    const [orders] = await conn.query(
      `SELECT o.*, JSON_ARRAYAGG(JSON_OBJECT('item_id', oi.item_id, 'qty', oi.qty)) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = ?
       GROUP BY o.id`,
      [orderId]
    );

    const newOrder = orders[0];

    // emit real-time event to the store room
    req.io.to(`store_${store_id}`).emit('new_order', newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// GET /orders?store_id=&page=&limit=
const getOrders = async (req, res) => {
  const { store_id, page = 1, limit = 10 } = req.query;

  if (!store_id) {
    return res.status(400).json({ error: 'store_id is required' });
  }

  const offset = (page - 1) * limit;

  try {
    const [orders] = await pool.query(
      `SELECT o.*, JSON_ARRAYAGG(JSON_OBJECT('item_id', oi.item_id, 'qty', oi.qty)) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.store_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [store_id, parseInt(limit), parseInt(offset)]
    );

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM orders WHERE store_id = ?',
      [store_id]
    );

    res.json({
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /orders/:id/status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [[order]] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    // emit real-time event to the store room
    req.io.to(`store_${order.store_id}`).emit('order_updated', order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /archive-old-orders
const archiveOldOrders = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO orders_archive (id, store_id, total_amount, status, created_at)
       SELECT id, store_id, total_amount, status, created_at
       FROM orders
       WHERE created_at < NOW() - INTERVAL 30 DAY`
    );

    const [result] = await conn.query(
      `DELETE FROM orders WHERE created_at < NOW() - INTERVAL 30 DAY`
    );

    await conn.commit();

    res.json({ message: `${result.affectedRows} orders archived` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// GET /orders/analytics/daily
const getDailyOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as total_orders
       FROM orders
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/analytics/revenue
const getRevenueByStore = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT store_id, SUM(total_amount) as total_revenue, COUNT(*) as total_orders
       FROM orders
       GROUP BY store_id
       ORDER BY total_revenue DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/analytics/top-items
const getTopItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT item_id, SUM(qty) as total_qty
       FROM order_items
       GROUP BY item_id
       ORDER BY total_qty DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateStatus,
  archiveOldOrders,
  getDailyOrders,
  getRevenueByStore,
  getTopItems
};