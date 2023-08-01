import { app } from './app';
import { env } from './env';

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.info(`Server is running 🚀`);
  })
  .catch(error => {
    app.log.error(error);
    process.exit(1);
  });
