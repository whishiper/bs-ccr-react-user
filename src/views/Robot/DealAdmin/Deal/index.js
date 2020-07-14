import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Affix, Tabs, Spin, message } from 'antd';
import Paho from 'paho-client/src/mqttws31';
import NewPageHeader from 'components/NewPageHeader/index';
import TradePlatformInfo from 'components/TradePlatformInfo';
import FormModal from './components/FormModal';
import SetBudgetModal from './components/SetBudgetModal';
import BatchHandleModal from './components/BatchHandleModal';
import Media from 'react-media';
import NewTabPane from './components/NewTabPane'

import AbortController from "abort-controller"
import { realTimeEarningRatio } from 'utils'

import style from './index.less';


const { TabPane } = Tabs;
let mqtt = null;

@connect(({ dealAdmin }) => ({ dealAdmin }))

class Deal extends Component {
  state = {
    isLink: false,
    linkNum: 0,
    abortController: new AbortController()
  };

  handleAbortController = () => {
    this.setState({
      abortController: new AbortController()
    })
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match

    dispatch({
      type: 'dealAdmin/start', payload: Object.assign(params, {
        startWebsocket: this.startWebsocket,
        closeWebsocket: this.closeWebsocket,
        signal: this.state.abortController.signal
      })
    });
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  // 限载页面
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.setState = (state, callback) => { return };
    this.closeWebsocket()

    console.log('------AbortController---')
    // 取消 ajax请求
    this.state.abortController.abort();
  }

  onTabChange = e => {
    const { dispatch } = this.props
    // 取消 ajax请求
    // this.state.abortController.abort();

    this.handleAbortController()
    dispatch({
      type: 'dealAdmin/onTabChange', payload: e
    });
  };


  // 开起 websocket
  startWebsocket = ({ symbols, webSocketName }) => {
    this.buildConnect();
    this.startGetAoleWebsocket({ symbols, webSocketName })
  }

  // 关闭 websocket 
  closeWebsocket = () => {
    this.disconnect();
    this.closeGetAoleWebsocket()
  }

  // 获取 货币对最新报价 webSocket
  async startGetAoleWebsocket({ symbols, webSocketName }) {
    const that = this

    if (webSocketName) {
      await webSocketName.init({
        symbols: symbols,
        getOpenPrice: (value) => {
          that.getOpenPrice(value)
        }
      })
    }

  }

  getOpenPrice(values) {
    const { dealAdmin, dispatch } = this.props;
    const { freeCoinPairList } = dealAdmin
    // console.log(freeCoinPairList,'------freeCoinPairList-----')
    console.log('========================================>', values)
    dispatch({
      type: 'dealAdmin/updateState', payload: {
        freeCoinPairList: freeCoinPairList.map(item => {

          if ((item.symbol === values.symbol) && Reflect.has(values, 'openPrice') && Reflect.get(values, 'openPrice')) {
            Object.assign(item, values)
            // console.log(item,'---------item-----item')
            // if (values.bids && item.position_num && item.position_cost) {
            //   let positionNum = Number(item.position_num)
            //   let positionCost = Number(item.positionCost)
            //   let real_time_earning_ratio = item.real_time_earning_ratio
            //   if(positionNum && positionCost) {

            //     real_time_earning_ratio= realTimeEarningRatio({
            //       deep_bids: values.bids,
            //       positionNum,
            //       positionCost,
            //     })
            //   }

            //   console.log(real_time_earning_ratio,'-----real_time_earning_ratio')
            //   Object.assign(item, { real_time_earning_ratio })
            // }
          }
          return item
        }
        )
      }
    })
  }

  // 关闭获取最新报价 webSocket
  closeGetAoleWebsocket = () => {
    const { dealAdmin } = this.props;
    const { webSocketName } = dealAdmin
    if (webSocketName) {
      webSocketName.close()
    }
  }

  // 获取交易信息 webSocket
  buildConnect = () => {
    const { dealAdmin } = this.props;
    const { mqttOptions } = dealAdmin;
    const {
      username = '',
      password = '',
      host,
      port,
      useTLS,
      cleansession,
      clientId
    } = mqttOptions;

    mqtt = new Paho.MQTT.Client(
      host, //MQTT 域名
      port, //WebSocket 端口，如果使用 HTTPS 加密则配置为443,否则配置80
      clientId //客户端 ClientId
    );
    const options = {
      timeout: 3,
      onSuccess: this.clientSuccess,
      mqttVersion: 4,
      cleanSession: cleansession,
      onFailure: this.clientFailure
    };

    mqtt.onConnectionLost = this.onConnectionLost;
    mqtt.onMessageArrived = this.onMessageArrived;

    if (username != null) {
      options.userName = username;
      options.password = password;
      options.useSSL = useTLS; //如果使用 HTTPS 加密则配置为 true
    }

    mqtt.connect(options);
    this.setState({ isLink: true });
  };

  // 订阅
  subscribe = (list, url) => {
    for (const [moduleName, _module] of Object.entries(list)) {
      for (const topic of Object.values(_module)) {
        if (moduleName === 'common') {
          try {
            mqtt.subscribe(topic, () => {
              console.log('订阅topic', topic);
            });
          } catch (error) {
            console.log(error, '订阅topic error');
          }
        }

        if (moduleName === 'private') {
          try {
            mqtt.subscribe(`${topic}${url}`, () => {
              console.log('订阅topic', topic);
            });
          } catch (error) {
            console.log(error, '订阅topic error');
          }
        }
      }
    }
  };

  // 连接成功
  clientSuccess = ms => {
    const { dealAdmin } = this.props;
    const { tradePatformApi, mqttOptions } = dealAdmin;
    const { tradePlatform, sign } = tradePatformApi;
    const plantFormName = tradePlatform.name || ''; // 平台
    const signId = sign;
    const { okexTopicList, huobiTopicList } = mqttOptions;

    if (!plantFormName && !signId) {
      return;
    }

    try {
      // 如果当前平台为okex则订阅okex相关topic
      if (plantFormName === 'okex') {
        this.subscribe(okexTopicList, `/okex/${signId}`);
      }

      // 如果当前平台为huobi则订阅huobi相关topic
      if (plantFormName === 'huobi') {
        this.subscribe(huobiTopicList, `/huobi/${signId}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // mqtt连接失败
  clientFailure = e => {
    // console.log('连接失败==================>clientFailure', e);
    const { linkNum } = this.state;
    this.setState({ isLink: false }, () => {
      if (linkNum < 4) {
        console.log(`=======断开====重连${linkNum}`);
        this.buildConnect();
        this.setState({ linkNum: linkNum + 1 });
      }
    });
  };

  // 连接丢失
  onConnectionLost = response => {
    const { linkNum } = this.state;
    // console.log(response, '连接丢失========================>onConnectionLost');
    if (response.errorCode === 0) {
      console.log('连接已断开');
    } else {
      if (linkNum < 4) {
        console.log(`=======连接丢失=====重连${linkNum}`);
        this.buildConnect();
        this.setState({ linkNum: linkNum + 1 });
      }
      this.setState({ isLink: false });
      console.log('异常：连接丢失' + response.errorMessage);
    }
  };

  // 接收消息事件
  onMessageArrived = res => {
    try {
      if (!res) {
        return;
      }

      const payload = JSON.parse(res.payloadString);
      const { type } = payload;

      if (type.includes('tradeError')) {
        console.log('tradeError==============>', payload);
        let errorText = `${payload.symbol || ''} ${payload.msg || ''}`
        if (errorText) {
          message.error(errorText);
        }

      }
      if (type.includes('updateSymbolPrice')) {
        console.log('updateSymbolPrice==============>', payload);
        this.handlePrice(payload);
      }

      if (type.includes('updateSymbolTradeInfo')) {
        console.log('updateSymbolTradeInfo==============>', payload);
        this.handleInfo(payload);
      }

      if (type.includes('updateCurrencyBalance')) {
        console.log('updateCurrencyBalance==============>', payload);
        this.handlebalance(payload);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 断开mqtt连接
  disconnect = () => {
    const { isLink } = this.state;
    if (isLink) {
      if (mqtt) {
        mqtt.disconnect();
        mqtt = null;
      }
    }
  };

  // websocket 获取 自选币价格
  handlePrice = res => {
    const { list, plantFormName } = res;
    const { dealAdmin, dispatch } = this.props;
    const { freeCoinPairList, tradePatformApi } = dealAdmin;
    const { tradePlatform } = tradePatformApi;
    console.log(res, '-----------------price');

    if (
      tradePlatform.name &&
      plantFormName === tradePlatform.name &&
      JSON.stringify(freeCoinPairList) !== '[]'
    ) {
      const newList = freeCoinPairList.map(item => {
        const hasItem = list.find(i => i.symbol === item.symbol) || {};
        console.log(hasItem, '--------hasItem');
        Object.assign(item, hasItem);
        return item;
      });
      console.log(newList, '------newList');
      dispatch({
        type: 'dealAdmin/updateState',
        payload: { freeCoinPairList: newList }
      });
      sessionStorage.setItem('freeCoinPairList', JSON.stringify(newList));
    }
  };

  // websocket 获取 自选币信息
  handleInfo = res => {
    const { plantFormName } = res;
    const { dealAdmin, dispatch } = this.props;
    const { freeCoinPairList, tradePatformApi } = dealAdmin;
    const { tradePlatform } = tradePatformApi;
    console.log(res, '---------info');

    if (
      tradePlatform.name &&
      plantFormName === tradePlatform.name &&
      JSON.stringify(freeCoinPairList) !== '[]'
    ) {
      const newList = freeCoinPairList.map(item => {
        if (res.symbol === item.symbol) {
          Object.assign(item, res);
        }
        return item;
      });

      dispatch({
        type: 'dealAdmin/updateState',
        payload: { freeCoinPairList: newList }
      });
      sessionStorage.setItem('freeCoinPairList', JSON.stringify(newList));
    }
  };
  // websocket 获取 自选币资产
  handlebalance = res => {
    const { dealAdmin, dispatch } = this.props;
    const { currencyInfo = {} } = dealAdmin;

    console.log(res, '===============>balance');

    const { budget_total = '',
      position_cost_total = '',
      trading_symbol_num = '',
      balance = {}
    } = res

    const newCurrencyInfo = {
      budget_total,
      position_cost_total,
      trading_symbol_num,
      balance
    }

    if (JSON.stringify(currencyInfo) !== '{}') {
      dispatch({
        type: 'dealAdmin/updateState',
        payload: { currencyInfo: newCurrencyInfo }
      });
    }
  };

  handleResize = e => {
    const card_container = document.getElementById('card_container');
    if (!card_container) {
      return;
    }

    const ant_tabs_ink_bar = card_container.getElementsByClassName(
      'ant-tabs-ink-bar'
    );
    if (ant_tabs_ink_bar && ant_tabs_ink_bar[0]) {
      ant_tabs_ink_bar[0].style.width = card_container.offsetWidth / 5 + 'px';
    }

    const tabs_item = card_container.getElementsByClassName('tabs_item');
    if (!tabs_item) {
      return;
    }
    for (let i = 0; i < tabs_item.length; i++) {
      tabs_item[i].style.width = card_container.offsetWidth / 5 - 32 + 'px';
    }
  };

  getCurrencyInfo = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'dealAdmin/getCurrencyInfo' });
  };

  render() {
    const { dealAdmin, dispatch, match } = this.props;
    const {
      freeCoinPairList = [],
      activeTabsKey,
      activeItem,
      tradePatformApi,
      coinSortList = [],
      dealParamsForm,
      dealFormModalVisible,
      BatchHandleModalVisible,
      tradeLoading,
    } = dealAdmin;

    const { params } = match;
    const { robotId } = params;

    const card_container_width = () => {
      const card_container = document.getElementById('card_container');
      let width = 200;
      if (card_container) {
        width = card_container.offsetWidth / 5 - 32;
      }
      return width;
    };

    const onBack = () => {
      dispatch(routerRedux.push('/ccr/robot/ccr'));
      sessionStorage.removeItem('tradePatformApi');
      sessionStorage.removeItem('freeCoinPairList');
    };

    const handleBatchHandleModalOk = values => {
      dispatch({
        type: 'dealAdmin/handleBatchHandleModalOk',
        payload: values
      });
    };

    const handleBatchHandleModalCancel = form => {
      dispatch({
        type: 'dealAdmin/handleBatchHandleModalCancel',
        payload: form
      });
    };

    const setDealParamsModalOk = values => {
      dispatch({
        type: 'dealAdmin/setDealParamsModalOk',
        payload: values
      });
    };

    const setDealParamsModalCancel = form => {
      dispatch({
        type: 'dealAdmin/setDealParamsModalCancel',
        payload: form
      });
    };


    const renderTabBar = (props, DefaultTabBar) => (
      <Affix offsetTop={66} style={{ paddingTop: '10px', background: '#fff' }}>
        <DefaultTabBar {...props} style={{ background: '#fff' }} />
      </Affix>
    );

    return (
      <>
        <NewPageHeader title="交易管理" onBack={onBack} />
        <div className={style.warpper}>
          <Spin tip="Loading..." spinning={tradeLoading} delay="120">
            <TradePlatformInfo
              robotId={robotId}
              tradePatformApi={tradePatformApi}
            />
          </Spin>
          <div className="card-container" id="card_container">
            <Tabs
              defaultActiveKey={`${activeTabsKey}`}
              activeKey={`${activeTabsKey}`}
              onChange={this.onTabChange}
              tabBarGutter={0}
              renderTabBar={renderTabBar}
            >
              {
                coinSortList.map(item => {
                  let tab = (
                    <div
                      style={{
                        width: `${card_container_width()}px`,
                        textAlign: 'center'
                      }}
                      className="tabs_item"
                    >
                      <Media
                        query="(max-width: 768px)"
                        render={() => (
                          <>{item.coin ? `${item.coin.name.toUpperCase()}` : ''}</>
                        )}
                      />
                      <Media
                        query="(min-width: 769px)"
                        render={() => (
                          <>{item.coin ? `${item.coin.name.toUpperCase()}计价` : ''}</>
                        )}
                      />
                    </div>
                  );
                  return <TabPane tab={tab} key={item.coin ? item.coin.id : ''}>
                    <NewTabPane dispatch={dispatch} dealAdmin={dealAdmin} match={match} />
                  </TabPane>
                })
              }

            </Tabs>
          </div>

          <FormModal
            dealParamsForm={dealParamsForm}
            visible={dealFormModalVisible}
            handleOk={setDealParamsModalOk}
            handleCancel={setDealParamsModalCancel}
          />
          <SetBudgetModal />

          <BatchHandleModal
            visible={BatchHandleModalVisible}
            handleOk={handleBatchHandleModalOk}
            handleCancel={handleBatchHandleModalCancel}
            activeItem={activeItem}
            list={freeCoinPairList.filter(
              item => !(item.isStart === 1 && Number(item.trade_status) === 0)
            )}
            dispatch={dispatch}
          />
        </div>
      </>
    );
  }
}

export default Deal;
