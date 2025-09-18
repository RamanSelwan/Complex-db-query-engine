const readline = require("readline");
const queries = require("./db/queries");
const exportToCsv = require("./utils/exportCsv");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mainMenu = () => {
  console.log("Welcome to the Complex Database Query Engine");
  console.log("1. Get Cross Join Recommendations");
  console.log("2. Find Users with Total Order Value > $1000");
  console.log("3. Get Top-Selling Products per User");
  console.log("4. Exit");
  console.log("5. Export Recommendations to CSV");
  console.log("6. Export High Value Users to CSV");
  console.log("7. Export Top-Selling Products to CSV");

  rl.question("Please select an option: ", async (option) => {
    switch (option) {
      case "1":
        await getCrossJoinRecommendations();
        break;
      case "2":
        await findHighValueUsers();
        break;
      case "3":
        await getTopSellingProducts();
        break;
      case "4":
        rl.close();
        break;
      case "5":
        await exportRecommendationsToCsv();
        break;
      case "6":
        await exportHighValueUsersToCsv();
        break;
      case "7":
        await exportTopSellingProductsToCsv();
        break;
      default:
        console.log("Invalid option. Please try again.");
        mainMenu();
    }
  });
};

// Normal functions (display on console)
const getCrossJoinRecommendations = async () => {
  try {
    const recommendations = await queries.getUserProductRecommendations();
    console.log("Cross Join Recommendations:", recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
  mainMenu();
};

const findHighValueUsers = async () => {
  try {
    const users = await queries.getHighValueUsers();
    console.log("Users with Total Order Value > $1000:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  mainMenu();
};

const getTopSellingProducts = async () => {
  try {
    const topProducts = await queries.getTopSellingProductsPerUser();
    console.log("Top-Selling Products per User:", topProducts);
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
  }
  mainMenu();
};




// Export functions (save as CSV)
const exportRecommendationsToCsv = async () => {
  try {
    const recommendations = await queries.getUserProductRecommendations();
    if (!recommendations.length) {
      console.log("No recommendations available to export.");
    } else {
      exportToCsv(recommendations, "recommendations.csv");
    }
  } catch (error) {
    console.error("Error exporting recommendations:", error);
  }
  mainMenu();
};

const exportHighValueUsersToCsv = async () => {
  try {
    const users = await queries.getHighValueUsers();
    if (!users.length) {
      console.log("No high value users available to export.");
    } else {
      exportToCsv(users, "high_value_users.csv");
    }
  } catch (error) {
    console.error("Error exporting high value users:", error);
  }
  mainMenu();
};

const exportTopSellingProductsToCsv = async () => {
  try {
    const products = await queries.getTopSellingProductsPerUser();
    if (!products.length) {
      console.log("No top-selling products available to export.");
    } else {
      exportToCsv(products, "top_selling_products.csv");
    }
  } catch (error) {
    console.error("Error exporting top-selling products:", error);
  }
  mainMenu();
};

mainMenu();
