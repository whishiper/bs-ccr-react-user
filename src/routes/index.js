import {
  API,
  CCR,
  Settings,
} from 'views'

export const ccrRoutes = [{
  pathname: '/ccr/user',
  title: '用户管理',
  icon: 'user',
  isNav: true,
  roles: ['user'],
  childrens: [{
    pathname: '/ccr/user/api',
    component: API,
    title: 'API',
    icon: null,
    exact: true,
    roles: ['user'],
  }]
}, {
  pathname: '/ccr/robot',
  title: '我的机器人',
  icon: 'android',
  isNav: true,
  roles: ['user'],
  childrens: [{
    pathname: '/ccr/robot/ccr',
    component: CCR,
    title: 'CCR',
    icon: null,
    exact: true,
    roles: ['user'],
  },
  ]
}, {
  pathname: '/ccr/settings',
  exact: true,
  isNav: false,
  roles: ['user'],
  component: Settings,
}
]