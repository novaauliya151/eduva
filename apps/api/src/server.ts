import {app} from './app.js';import {env} from './config.js';import {startLiveReminderWorker} from './services/liveReminderService.js';
startLiveReminderWorker();app.listen(env.PORT,()=>console.log(`Eduva API: http://localhost:${env.PORT}`));
