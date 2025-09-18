const express = require("express");
const bodyParser = require("body-parser");
const queries = require("./db/queries");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Recommendations without pagination
app.get("/api/recommendations", async (req, res) => {
  try {
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 100;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const { rows, total } = await queries.getUserProductRecommendations(
      maxPrice,
      offset,
      limit
    );

    res.json({
      success: true,
      data: rows,
      metadata: {
        offset,
        limit,
        currentPage: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        hasPrevPage: offset > 0,
        hasNextPage: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).send("Internal Server Error");
  }
});


// High-value users (with pagination)
app.get("/api/users/high-value-orders", async (req, res) => {
  try {
    const minValue = req.query.minValue ? Number(req.query.minValue) : 1000;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    // Pass minValue, offset, limit to query function
    const { rows, total } = await queries.getHighValueUsers(
      minValue,
      offset,
      limit
    );

    res.json({
      success: true,
      data: rows,
      total: total,
      pagination: {
        offset,
        limit,
        currentPage: Math.floor(offset / limit) + 1,
        pageSize: limit,
        total,
          hasPrevPage: offset > 0,
        hasNextPage: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching users with high value orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Top-selling products with pagination
app.get("/api/products/top-selling", async (req, res) => {
  try {
    // Extract query params (default offset=0, limit=10)
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Call function with pagination
    const { rows, total } = await queries.getTopSellingProductsPerUser(
      offset,
      limit
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        offset,
        limit,
        currentPage: Math.floor(offset / limit) + 1,
        pageSize: limit,
        total,
          hasPrevPage: offset > 0,
        hasNextPage: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Place an order
app.post("/api/place-order", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, and quantity are required.",
      });
    }

    const result = await queries.placeOrderWithStockUpdate(
      userId,
      productId,
      quantity
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
