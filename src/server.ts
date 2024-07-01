import { app } from "./app";
import { logger } from "./config/wistonLogger";

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.listen(PORT, () => {
  logger.info(`Listening to port ${PORT}😎`);
});
