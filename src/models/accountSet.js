import {
  bindGoogleAuth,
  verifyGoogleCode,
  userBindGoogle,
  byTelGetUserInfo,
  updateTel,
  verifyTelCode,
  updatePassword,
  verifyPasswordCode,
} from "services/app";
import { routerRedux } from "dva/router";
import { message } from "antd";
import { updateState } from 'utils/handlerResults'

const delay = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default {
  namespace: "accountSet",
  state: {
    bindGoogleModalVisible: false,
    changePasswordModelVisible: false, //ChangePasswordModel，hlh
    phoneNumberModelVisible: false, // 手机号码，hlh
    loading: false,
    codeButText: "获取验证码",
    passwordCodeButText: "获取验证码",
    codeUrl: "",
    secret: "",
    password: "",
    phone: "",
    formData: {
      phone: "",
      password: ""
    },
    formPassword: {
      password: "",
      lastpassword: ""
    },
    val: ""
  },

  effects: {
    *timer({ payload }, { put, call }) {
      const obj = {};
      let second = 60;

      while (second > 0) {
        second--;
        obj[`${payload}`] = second === 0 ? "获取验证码" : `${second}秒后重发`;

        yield updateState(obj, put)

        yield call(delay, 1000);
      }
    },

    // 更换手机 获取验证码 hlh
    *PhoneCode({ payload }, { call, put }) {
      try {
        const data = yield call(verifyTelCode, payload);

        if (
          typeof data === "object" &&
          Reflect.has(data, "message") &&
          Reflect.get(data, "message") === "OK"
        ) {
          message.error(Reflect.get(data, "message"));
        }

        message.success("发送验证码成功！");
      } catch (e) {
        let error = "发送验证码失败！";
        // const err = yield e.response.json();

        if (!(typeof err === "object" && Reflect.has(e, "error"))) {
          error = e.error;
        }

        message.error(error);
      }
    },

    *new_PhoneCode({ payload }, { call, put }) {
      try {
        const data = yield call(verifyTelCode, payload);
        if (
          !(
            typeof data === "object" &&
            Reflect.has(data, "Message") &&
            Reflect.get(data, "Message") === "OK"
          )
        ) {
          message.error(Reflect.get(data, "Message"));
        }

        message.success("发送验证码成功！");
      } catch (e) {
        let error = "发送验证码失败！";
        const err = yield e.response.json();

        if (!(typeof err === "object" && Reflect.has(err, "error"))) {
          error = e.error;
        }

        message.error(error);
      }
    },

    //更换手机按钮
    *handleModifyPhone(_, { put }) {

      yield updateState({ phoneNumberModelVisible: true }, put)
    },

    //修改手机回调
    *handleKeepPhone({ payload }, { call, put }) {
      const { values, form } = payload;
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      const is_true = !(typeof userInfo === "object" && Reflect.has(userInfo, "id"))
      if (is_true) {
        return;
      }

      try {
        const params = {
          id: String(userInfo.id),
          tel: values.tel,
          new_tel: values.new_tel,
          code: values.code
        };

        const data = yield call(updateTel, params);

        if (
          !(
            typeof data === "object" &&
            Reflect.has(data, "msg") &&
            Reflect.get(data, "msg") === "success"
          )
        ) {
          message.error(data.msg);
          return;
        }

        yield put(routerRedux.push('/login'));
        message.success("更换手机成功!");
        form.resetFields();
      } catch (e) {
        let error = "更换手机失败!";
        const err = yield e.response.json();

        if (typeof err === "object" && Reflect.has(err, "errors")) {
          error = err.errors;
        }

        message.error(error);
      }
    },

    // 密码验证码 获取验证码 hlh
    *PasswordCode({ payload }, { call, put }) {
      try {
        yield put({ type: "timer", payload: "passwordCodeButText" });

        const data = yield call(verifyPasswordCode, payload);

        if (
          !(
            typeof data === "object" &&
            Reflect.has(data, "Message") &&
            Reflect.get(data, "Message") === "OK"
          )
        ) {
          message.error(Reflect.get(data, "Message"));
        }

        message.success("发送验证码成功！");
      } catch (e) {
        let error = "发送验证码失败！";

        if (!(typeof data === "object" && Reflect.has(e, "error"))) {
          error = e.error;
        }

        message.error(error);
      }
    },

    //点击修改密码
    *handleModifyPassword(_, { put }) {

      yield updateState({ changePasswordModelVisible: true }, put)
    },

    //修改密码回调
    *handleKeepPassword({ payload }, { call, put }) {
      const { values, form } = payload;
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      if (
        !(
          typeof userInfo === "object" &&
          Reflect.has(userInfo, "id") &&
          Reflect.get(userInfo, "tel")
        )
      ) {
        return;
      }

      try {
        const params = {
          id: String(userInfo.id),
          tel: userInfo.tel,
          code: values.code,
          password: values.password
        };

        const data = yield call(updatePassword, params);

        if (
          !(
            typeof data === "object" &&
            Reflect.has(data, "msg") &&
            Reflect.get(data, "msg") === "success"
          )
        ) {
          message.error(data.msg);
        }
        yield put(routerRedux.push('/login'));
        message.success("修改密码成功,请重新登陆!");

        form.resetFields();
      } catch (err) {
        message.error("修改密码失败!");
      }
    },

    // *******************************绑定谷歌**********************************

    // 绑定谷歌验证
    *handleBindGoogleModalShow(_, { put, call, select }) {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};

      const new_payload = {
        bindGoogleModalVisible: true,
        loading: true
      }
      yield updateState(new_payload, put)

      const params = {
        accessKey: userInfo.accessKey,
        secretKey: userInfo.secretKey,
        account: userInfo.tel
      };
      let data;

      try {
        data = yield call(bindGoogleAuth, params);

        if (
          !(
            typeof data === "object" &&
            Reflect.has(data, "base64Code") &&
            Reflect.has(data, "secret")
          )
        ) {
          message.error("获取谷歌二维码失败");
          return;
        }
      } catch (e) {
        message.error("获取谷歌二维码失败");
      }

      const code = {
        loading: false,
        codeUrl: data.base64Code,
        secret: data.secret
      }
      yield updateState(code, put)
    },

    // 验证谷歌
    *handleBindGoogleModalOk({ payload }, { put, call, select }) {
      const { accountSet } = yield select(_ => _);
      const { values, form } = payload;

      const params = {
        code: values.code,
        secret: accountSet.secret
      };

      try {
        const data = yield call(verifyGoogleCode, params);

        const is_verify_true =           !(
          typeof data === "object"
           && Reflect.has(data, "msg")
           &&Reflect.get(data, "msg") === "match success"
        )

        console.log(is_verify_true, '-is_verify_true')

        if (is_verify_true) {
          message.error("验证不正确");
          return;
        }

        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        const { id } = userInfo;
        const user_bind_google_data = yield call(userBindGoogle, { id });

        if (
          !(
            user_bind_google_data
            && typeof user_bind_google_data === "object"
            && Reflect.has(data, "msg")
            && Reflect.get(data, "msg") === "success"
            && Reflect.has(data, "data")
            && Number(Reflect.get(data, "data")) === 1
          )
        ) {
          message.error("绑定未成功");
          return;
        }

        const userInfo_data = yield call(byTelGetUserInfo, {
          tel: userInfo.tel
        });

        if (
          !(typeof userInfo_data === "object"
            && Reflect.has(userInfo_data, "id")
            && Reflect.has(userInfo_data, "tel"))
        ) {
          return;
        }

        yield sessionStorage.setItem("userInfo", JSON.stringify(userInfo_data));
        message.success("绑定成功");
      } catch (e) {
        message.error("绑定未成功");
        return;
      }

      yield updateState({ bindGoogleModalVisible: false }, put)
      form.resetFields();
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  }
};
