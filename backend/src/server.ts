import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { SchoolController } from './controllers/school.controller';

validateEnv();

const app = new App([IndexController, UserController, HealthController, SchoolController]);

app.listen();
