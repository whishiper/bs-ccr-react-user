import React, { Component } from 'react'
import { connect } from 'dva'
import { flattenDeep } from 'lodash'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ccrRoutes } from './routes'
import { IndexPage } from 'views'
const menus = ccrRoutes.filter(route => route.isNav === true)
const mainRoutes = ccrRoutes.filter(route => route.isNav === false)

const childrenRoutes = menus.map(item => item.childrens)

let newMainRoutes = flattenDeep([...childrenRoutes, ...mainRoutes])

@connect(({ app }) => ({ app }))

class App extends Component {

  render() {
    const { app } = this.props
    const { role } = app

    return (
      sessionStorage.getItem('access_token') && sessionStorage.getItem('userInfo')
        ?
        <Switch>
          <IndexPage menus={menus}>
            <Switch>
              {newMainRoutes.map(item => (
                <Route
                  key={item.pathname}
                  path={item.pathname}
                  exact={item.exact}
                  render={(routerProps) => {
                    const hasPermission = item.roles.includes(role || 'user')
                    return hasPermission ? <item.component {...routerProps} /> : <Redirect to="/noauth" />
                  }}
                />
              ))}
              <Redirect to={newMainRoutes[0].pathname} from='/ccr' exact />
              <Redirect to="/404" />
            </Switch>
          </IndexPage>
        </Switch>
        :
        <Redirect to="/login" />
    )
  }
}

export default App
