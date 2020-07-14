import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { connect } from 'dva';
import { Layout } from 'antd';
import CCRHeader from 'components/Header'
import CCRSider from 'components/Sider'
// import style from './IndexPage.less';


const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
@withRouter

@connect(({ app }) => ({ app }))

class IndexPage extends Component {

  render() {
    const selectedKeyArr = this.props.location.pathname.split('/')
    selectedKeyArr.length = 4
    const { app, dispatch, children, menus } = this.props;
    const { collapsed } = app
    const newclassnames = classNames

    const toggle = () => {
      dispatch({
        type: 'app/updateState', payload: {
          collapsed: !collapsed
        }
      })
    };

    const onMenuClick = ({ key }) => {
      this.props.history.push(key)
    }

    return (
      <ContainerQuery
        style={{
          margin: '24px 16px',
          background: '#fff',
          height: 'calc(100% - 48px)',
        }}
        query={query}
      >
        {(params) => (
          <Layout
            className={newclassnames(params)}
            style={{ height: '100%', display: 'flex' }}
          >
            <CCRSider
              onMenuClick={onMenuClick}
              collapsed={collapsed}
              toggle={toggle}
              menus={menus}
              selectedKeyArr={selectedKeyArr}
            />
            <Layout style={{ height: '100%', flex: 1 }}>
              <CCRHeader collapsed={collapsed} toggle={toggle} />
              <Content style={{ padding: '24px 16px 0', overflow: 'auto' }}>
                {children}
              </Content>
            </Layout>
          </Layout>
        )}
      </ContainerQuery>
    );
  }

}

export default IndexPage
