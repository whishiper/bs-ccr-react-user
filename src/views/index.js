import NoAuth from 'views/NoAuth';
import NotFound from 'views/NotFound';
import Loadable from 'react-loadable'
import Loading from 'components/Loading'
// import Fivehundred from 'views/Exception/500';

const Login = Loadable({
  loader: () => import('./Login'),
  loading: Loading,
   delay: 300
})
const Register = Loadable({
  loader: () => import('./Register'),
  loading: Loading,
   delay: 300
})
const Forget = Loadable({
  loader: () => import('./Forget'),
  loading: Loading,
   delay: 300
})
const IndexPage = Loadable({
  loader: () => import('./IndexPage'),
  loading: Loading,
   delay: 300
})
const API = Loadable({
  loader: () => import('./API'),
  loading: Loading,
   delay: 300
})
const CCR = Loadable({
  loader: () => import('./Robot/CCR'),
  loading: Loading,
   delay: 300
})

const ProfitSummary = Loadable({
  loader: () => import('./Robot/ProfitSummary'),
  loading: Loading,
   delay: 300
})

const BuyLogs = Loadable({
  loader: () => import('./Robot/BuyLogs'),
  loading: Loading,
   delay: 300
})

const Deal = Loadable({
  loader: () => import('./Robot/DealAdmin/Deal'),
  loading: Loading,
   delay: 300
})

const BudgetSetting = Loadable({
  loader: () => import('./Robot/DealAdmin/BudgetSetting'),
  loading: Loading,
   delay: 300
})
const CoinPairsAdd = Loadable({
  loader: () => import('./Robot/DealAdmin/Add'),
  loading: Loading,
   delay: 300
})
const CoinPairsDetails = Loadable({
  loader: () => import('./Robot/DealAdmin/Details'),
  loading: Loading,
   delay: 300
})
const TradeHistory = Loadable({
  loader: () => import('./Robot/DealAdmin/TradeHistory'),
  loading: Loading,
   delay: 300
})
const Settings = Loadable({
  loader: () => import('./Settings'),
  loading: Loading,
   delay: 300
})
// const NoAuth = Loadable({
//   loader: () => import('./NoAuth'),
//   loading: Loading,
//  delay: 300
// })
// const NotFound = Loadable({
//   loader: () => import('./NotFound'),
//   loading: Loading,
//  delay: 300
// })


export {
  Login,
  Register,
  Forget,
  IndexPage,
  API,
  CCR,
  ProfitSummary,
  BuyLogs,
  Deal,
  BudgetSetting,
  CoinPairsAdd,
  CoinPairsDetails,
  TradeHistory,
  Settings,
  NoAuth,
  NotFound
}