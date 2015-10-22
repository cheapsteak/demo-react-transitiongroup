import React from 'react'
import { render, findDOMNode } from 'react-dom'
import ReactTransitionGroup from 'react-addons-transition-group'
import { createHistory, useBasename } from 'history'
import { Router, Route, Link } from 'react-router'
import animate from 'gsap-promise'


const history = useBasename(createHistory)({
  basename: '/animations'
})

class App extends React.Component {
  render() {
    const { pathname } = this.props.location

    return (
      <div>
        <ul>
          <li><Link to="/page1">Page 1</Link></li>
          <li><Link to="/page2">Page 2</Link></li>
        </ul>
        <ReactTransitionGroup component="div" transitionName="example">
          {React.cloneElement(this.props.children || <div />, { key: pathname })}
        </ReactTransitionGroup>
      </div>
    )
  }

}

class Page1 extends React.Component {

  constructor (props) {
    super(props)
    this.animationStates = {
      initial: {yPercent: 50, opacity: 0},
      default: {yPercent: 0, opacity: 1},
      out: {yPercent: -10, opacity: 0},
    }
  }

  render() {
    return (
      <div className="image">
        <h1>Page 1</h1>
        <p><Link to="/page1" activeClassName="link-active">A link to page 1 should be active</Link>. Lorem ipsum dolor sit amet, consectetur adipisicing elit. <Link to="/page2" activeClassName="link-active">A link to page 2 should be inactive</Link>. Do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    )
  }

  animateIn () {
    return animate.fromTo(findDOMNode(this), 0.5, this.animationStates.initial, this.animationStates.default);
  }

  componentWillAppear(callback) {
    this.animateIn().then(callback);
  }

  componentWillEnter(callback) {
    this.animateIn().then(callback);
  }

  componentWillLeave(callback) {
    animate.to(findDOMNode(this), 0.5, this.animationStates.out).then(callback);
  }

}

class Page2 extends React.Component {

  constructor (props) {
    super(props)
    this.animationStates = {
      initial: {xPercent: 50, opacity: 0},
      default: {xPercent: 0, opacity: 1},
      out: {xPercent: -50, opacity: 0}
    }
  }

  render() {
    return (
      <div className="image">
        <h1>Page 2</h1>

        <LittleThing ref="littleThing"/>

        <p>Consectetur adipisicing elit, sed do <Link to="/page2" activeClassName="link-active">a link to page 2 should also be active</Link> eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    )
  }

  animateIn () {
    return Promise.all([
      this.refs.littleThing.animateIn(),
      animate.fromTo(findDOMNode(this), 0.5, this.animationStates.initial, this.animationStates.default)])
  }

  animateOut () {
    this.refs.littleThing.animateOut()
    return animate.to(findDOMNode(this), 0.5, this.animationStates.out)
  }

  componentWillAppear(callback) {
    this.animateIn().then(callback)
  }

  componentWillEnter(callback) {
    this.animateIn().then(callback)
  }

  componentWillLeave(callback) {
    this.animateOut().then(callback)
  }
}

class LittleThing extends React.Component {

  constructor (props) {
    super(props)
    this.animationStates = {
      initial: {xPercent: 400, rotationZ: 180, opacity: 0},
      default: {xPercent: 0, rotationZ: 0, opacity: 1},
      out: {xPercent: -400, rotationZ: -180, opacity: 0}
    }
  }

  render() {
    return (
      <div className="little-thing">

      </div>
    )
  }

  animateIn () {
    return animate.fromTo(findDOMNode(this), 0.5, this.animationStates.initial, this.animationStates.default)
  }

  animateOut () {
    return animate.to(findDOMNode(this), 0.5, this.animationStates.out)
  }

}

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="page1" component={Page1} />
      <Route path="page2" component={Page2} />
    </Route>
  </Router>
), document.getElementById('app'))