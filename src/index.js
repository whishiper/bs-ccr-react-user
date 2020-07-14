import dva from 'dva';
import './index.less';

// 1. Initialize
const app = dva({
  onAction: []
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
app.model({ namespace: 'app', ...(require('./models/app.js').default) });
app.model({ namespace: 'global', ...(require('./models/global.js').default) });
app.model({ namespace: 'login', ...(require('./models/login.js').default) });
app.model({ namespace: 'register', ...(require('./models/register.js').default) });
app.model({ namespace: 'forget', ...(require('./models/forget.js').default) });
app.model({ namespace: 'api', ...(require('./models/api.js').default) });
app.model({ namespace: 'ccr', ...(require('./models/ccr.js').default) });
app.model({ namespace: 'buyLogs', ...(require('./models/buyLogs.js').default) });
app.model({ namespace: 'tradeHistory', ...(require('./models/tradeHistory.js').default) });
app.model({ namespace: 'profitSummary', ...(require('./models/profitSummary.js').default) });
app.model({ namespace: 'dealAdmin', ...(require('./models/dealAdmin.js').default) });
app.model({ namespace: 'coinPairsDetails', ...(require('./models/coinPairsDetails.js').default) });
app.model({ namespace: 'addCoinPairs', ...(require('./models/addCoinPairs.js').default) });
app.model({ namespace: 'setBudget', ...(require('./models/setBudget.js').default) });
app.model({ namespace: 'accountSet', ...(require('./models/accountSet.js').default) });

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');