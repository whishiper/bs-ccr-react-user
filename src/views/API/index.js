import React, { Component } from "react";
import { connect } from "dva";
import { Card, Modal, List, Icon, Button, Spin, Tooltip } from "antd";
import FormModal from "./components/FormModal";
import style from "./index.less";
import robot from 'assets/robot.svg'

const { Meta } = Card;

@connect(({ api }) => ({ api }))

class API extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "api/start" });
  }

  render() {
    const { api, dispatch } = this.props;
    const {
      formVisible,
      formData,
      formType,
      apiList,
      tradePlatList,
      loading,
      apiFormLoading,
      tradeName
    } = api;

    const addApiFormShow = () => {
      dispatch({ type: "api/addApiFormShow" });
    };

    const coverItem = values => {
      if (values.key === -1) {
        return <Icon type="plus" className={style.add_api_icon} />;
      }
      console.log(values.tradePlatform.logo,'---values.tradePlatform.logo')
      return (
        <div style={{ height: "105px" }} className={style.trade_plarform_logo}>
          <img
            className={style.logo}
            alt="logo"
            src={values.tradePlatform ? `http://yun-img.bosenkeji.cn${values.tradePlatform.logo}` : ''}
          />
          <Tooltip placement="rightTop" title={'机器人监控中'}>
            <img
              src={robot}
              alt=''
              className={style.robot_iocn}
              style={{ display: Number(values.isBound) === 2 ? "block" : "none" }}
            />
          </Tooltip>
        </div>
      );
    };

    const actions = values => {
      const disabled = values.isBound === 2;

      if (!values) {
        return null;
      }

      if (values.key === -1) {
        return [<Button type="link" block>+ 添加API</Button>];
      }

      return [
        <Button type="link" disabled={disabled ? true : false} block onClick={() => { editApiFormShow(values) }}>
          编辑
        </Button>,
        <Button type="link" disabled={disabled ? true : false} block onClick={() => { confirm(values) }} >
          删除
        </Button>
      ];
    };

    const newMeta = values => {

      if (values.key === -1) {
        return "";
      }

      return (
        <Meta
          style={{ textAlign: "center", height: "53px" }}
          title={values.nickname || ""}
          description={<div className={style.description}>{values.accessKey || ""}</div>}
        />
      );
    };

    const confirm = item => {
      Modal.confirm({
        title: "删除交易平台账号",
        content: "删除后，可添加同一帐号下的其他API继承当前帐号的订单，确定删除？",
        okText: "确定",
        cancelText: "我再想想",
        centered: true,
        onOk() {
          dispatch({ type: "api/deleteApi", payload: item });
        }
      });
    };

    const editApiFormShow = values => {
      dispatch({ type: "api/editApiFormShow", payload: values });
    };

    const handleFormOk = values => {
      dispatch({
        type: "api/handleFormOk",
        payload: values
      });
    };

    const handleFormCancel = form => {
      dispatch({
        type: "api/handleFormCancel",
        payload: form
      });
    };

    return (
      <div>
        <Spin tip="Loading..." spinning={loading} delay="120">
          <div>
            <h4 className={style.title}>API管理</h4>
            <List
              style={{ margin: "-15px 0" }}
              grid={{ gutter: 16, xs: 1, sm: 1, md: 3, lg: 4, xl: 4, xxl: 4 }}
              dataSource={apiList}
              renderItem={item => (
                <List.Item
                  style={{ height: "246px", margin: "15px 0" }}
                  onClick={item.key === -1 ? addApiFormShow : null}
                >
                  <Card
                    hoverable={true}
                    bodyStyle={{ display: item.key === -1 ? 'none' : 'block' }}
                    cover={coverItem(item)}
                    actions={actions(item)}
                  >
                    {newMeta(item)}
                  </Card>
                </List.Item>
              )}
            />
            <FormModal
              loading={apiFormLoading}
              visible={formVisible}
              handleOk={handleFormOk}
              handleCancel={handleFormCancel}
              formData={formData}
              formType={formType}
              tradePlatList={tradePlatList}
              tradeName={tradeName}
              dispatch={dispatch}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default API;