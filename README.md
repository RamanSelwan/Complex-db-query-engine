# Complex Database Query Engine

This project is a Node.js application that connects to a PostgreSQL or MySQL database to perform advanced database queries, including cross joins, aggregations, and subqueries. The application is designed to demonstrate complex database operations and provide a command-line interface as well as an Express server for executing queries.

## Features

- **Cross Join Queries**: Generate a Cartesian product of users and products to create potential recommendations.
- **Complex Operations**: Use `GROUP BY` with `HAVING` to find users with a total order value greater than $1000, and perform joins with subqueries to identify top-selling products per user.
- **Prepared Statements**: Implement prepared statements to prevent SQL injection vulnerabilities.
- **Transaction Handling**: Wrap multiple operations in transactions using `BEGIN`, `COMMIT`, and `ROLLBACK` to ensure data integrity.
- **Performance Optimization**: Optimize slow cross join queries by adding indexes and limiting results with `OFFSET` and `FETCH`.
- **Pagination**: Implement pagination for large result sets to enhance user experience.
- **CSV Export**: Export query results to CSV format using the built-in `fs` module.

## Project Structure

```
complex-db-query-engine
├── src
│   ├── db
│   │   ├── index.js        # Database connection setup
│   │   └── queries.js      # Database query functions
│   ├── cli.js              # Command-line interface for executing queries
│   ├── server.js           # Express server setup with endpoints
│   └── utils
│       └── exportCsv.js    # Utility for exporting results to CSV
├── sample_data
│   └── seed.sql            # SQL statements for schema and sample data
├── package.json             # npm configuration file
├── .env                     # Environment variables for database connection
└── README.md                # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/complex-db-query-engine.git
   cd complex-db-query-engine
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your database:
   - Create a PostgreSQL or MySQL database.
   - Update the `.env` file with your database connection settings.

4. Seed the database with sample data:
   ```
   psql -U yourusername -d yourdatabase -f sample_data/seed.sql
   ```

5. Run the application:
   - For the CLI:
     ```
     node src/cli.js
     ```
   - For the Express server:
     ```
     node src/server.js
     ```

## Usage

- Use the CLI to execute queries interactively.
- Access the Express server endpoints to perform queries via HTTP requests.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.