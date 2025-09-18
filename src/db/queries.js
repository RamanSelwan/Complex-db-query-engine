const db = require("./index");

// Get recommendations without pagination
const getUserProductRecommendations = async (
  maxPrice = 500,
  offset = 0,
  limit = 10
) => {
  const query = `
    SELECT u.id AS user_id, u.name AS user_name, 
           p.id AS product_id, p.name AS product_name
    FROM users u
    CROSS JOIN products p
    WHERE p.price < ?
    LIMIT ${Number(limit)} OFFSET ${Number(offset)};
  `;

  const [rows] = await db.query(query, [Number(maxPrice)]);

  // Count query for total records (without limit/offset)
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users u
    CROSS JOIN products p
    WHERE p.price < ?;
  `;
  const [countRows] = await db.query(countQuery, [Number(maxPrice)]);

  return { rows, total: countRows[0].total };
};
const getHighValueUsers = async (minValue = 1000, offset = 0, limit = 10) => {
  // Main query with pagination (direct interpolation)
  const query = `
    SELECT u.id, u.name, SUM(o.quantity * p.price) AS total_value
    FROM users u
    JOIN orders o ON u.id = o.user_id
    JOIN products p ON o.product_id = p.id
    GROUP BY u.id
    HAVING SUM(o.quantity * p.price) > ${Number(minValue)}
    ORDER BY total_value DESC
    LIMIT ${Number(limit)} OFFSET ${Number(offset)};
  `;
  const [rows] = await db.query(query);

  // Count query (without pagination)
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT u.id
      FROM users u
      JOIN orders o ON u.id = o.user_id
      JOIN products p ON o.product_id = p.id
      GROUP BY u.id
      HAVING SUM(o.quantity * p.price) > ${Number(minValue)}
    ) AS subquery;
  `;
  const [countRows] = await db.query(countQuery);

  const total = countRows[0]?.total || 0;

  return { rows, total };
};


//  *******************************************

const getTopSellingProductsPerUser = async (offset = 0, limit = 10) => {
  // Main query with pagination
  const query = `
    SELECT u.id AS user_id, u.name AS user_name, 
           p.id AS product_id, p.name AS product_name, 
           SUM(o.quantity) AS total_quantity
    FROM users u
    JOIN orders o ON u.id = o.user_id
    JOIN products p ON o.product_id = p.id
    GROUP BY u.id, p.id
    ORDER BY total_quantity DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const [rows] = await db.query(query);

  // Count query (fixed with aliases)
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT u.id AS user_id, p.id AS product_id
      FROM users u
      JOIN orders o ON u.id = o.user_id
      JOIN products p ON o.product_id = p.id
      GROUP BY u.id, p.id
    ) AS subquery;
  `;

  const [countRows] = await db.query(countQuery);

  return {
    rows,                  // paginated results
    total: countRows[0].total,  // total number of records
  };
};





// Function to place an order and update stock
const placeOrderWithStockUpdate = async (userId, productId, quantity) => {
  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert order
    await connection.execute(
      "INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, quantity]
    );

    // Update product stock (assuming a 'stock' column exists)
    const [productRows] = await connection.execute(
      "SELECT stock FROM products WHERE id = ?",
      [productId]
    );
    if (!productRows.length || productRows[0].stock < quantity) {
      throw new Error("Insufficient stock");
    }

    await connection.execute(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [quantity, productId]
    );

    await connection.commit();
    return { success: true, message: "Order placed and stock updated." };
  } catch (err) {
    await connection.rollback();
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

// Exporting the functions for use in other modules
module.exports = {
  getUserProductRecommendations,
  getHighValueUsers,
  getTopSellingProductsPerUser,
  placeOrderWithStockUpdate,
};
