import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { SchoolController } from './controllers/school.controller';
import { EmployeeController } from '@/controllers/employee.controller';
import { initRedis } from '@utils/initRedis';

validateEnv();

async function bootstrap() {
  // Connects Redis only when SESSION_STORE=redis; App then builds the session store from it.
  await initRedis();

  const app = new App([IndexController, UserController, HealthController, SchoolController, EmployeeController]);

  app.listen();
}

bootstrap().catch(err => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
