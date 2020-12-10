import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Menu from './component/menu'
import About from './component/about'
import Library from './component/library'
import Profile from './component/profile'
import Register from './component/register'
import Login from './component/login'


class Index extends Component {
    render() {
        return (
            <Router >
                <div>
                    <Menu />
                    <div>
                        <Route exact path="/" component={About} />
                        <Route path="/about" component={About} />
                        <Route path="/library" component={Library} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/profile" component={Profile} />
                    </div>
                </div>
            </Router>
        )
    }
}
render(<Index />, document.getElementById('app'))
export default Index