// utils/exportToCsv.js
const fs = require("fs");
const path = require("path");

function exportToCsv(data, fileName) {
  if (!Array.isArray(data) || data.length === 0) {
    console.log("No data available to export.");
    return;
  }

  // Headers from object keys
  const headers = Object.keys(data[0]).join(",");
  // Values from each row
  const rows = data.map(obj => Object.values(obj).join(",")).join("\n");

  const csvContent = headers + "\n" + rows;

  const filePath = path.join(__dirname, "..", fileName);
  fs.writeFileSync(filePath, csvContent);

  console.log(`✅ Data exported successfully to ${filePath}`);
}

// 👇 Correct way to export
module.exports = exportToCsv;
