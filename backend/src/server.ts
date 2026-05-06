import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Auth endpoint available at: http://localhost:${PORT}/api/auth/register`);
  console.log(`Customers endpoint available at: http://localhost:${PORT}/api/customers`);
});