import dotenv from 'dotenv';
import { AbortSignal } from 'node-abort-controller';
global.AbortSignal = AbortSignal;
dotenv.config({ path: './.env.dev-public' });

process.env.IS_TEST_ENV = true;
