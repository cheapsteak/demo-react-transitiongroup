import Vue from 'vue'
import Router from 'vue-router'
import animate from 'gsap-promise'
import domready from 'domready'

Vue.use(Router)

Vue.transition('animate-in-out', {
  enter: function (el, done) {
    if (this.animateIn) {
      this.animateIn().then(done)
    } else {
      done()
    }
  },

  beforeLeave (el) {
    console.log(this.$.littlething);
  },
  leave: function (el, done) {
    if (this.animateOut) {
      this.animateOut().then(done)
    } else {
      done()
    }
  }
})

const App = {
  template: `
    <a v-link="{path: 'page1'}">Page 1</a>
    <a v-link="{path: 'page2'}">Page 2</a>
    <router-view v-transition="animate-in-out"></router-view>
  `,
  replace: false
}

const router = new Router({
  history: true
})

const Page1 = {
  template: `
    <div class="image">
      <h1>Page 1</h1>
      <p><a v-link="'/page1'" activeClassName="link-active">A link to page 1 should be active</a>. Lorem ipsum dolor sit amet, consectetur adipisicing elit. <a v-link="'/page2'" activeClassName="link-active">A link to page 2 should be inactive</a>. Do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  `,

  data () {
    return {
      animationStates: {
        initial: {yPercent: 50, opacity: 0},
        default: {yPercent: 0, opacity: 1},
        out: {yPercent: -10, opacity: 0},
      }
    };
  },

  methods: {
    animateIn () {
      return animate.fromTo(this.$el, 0.5, this.animationStates.initial, this.animationStates.default);
    },

    animateOut () {
      return animate.to(this.$el, 0.5, this.animationStates.out)
    }
  }
}

const LittleThing = {
  template: `<div class="little-thing"></div>`,

  data () {
    return {
      animationStates: {
        initial: {xPercent: 400, rotationZ: 180, opacity: 0},
        default: {xPercent: 0, rotationZ: 0, opacity: 1},
        out: {xPercent: -400, rotationZ: -180, opacity: 0}
      }
    };
  },

  methods: {
    animateIn () {
      return animate.fromTo(this.$el, 0.5, this.animationStates.initial, this.animationStates.default)
    },

    animateOut () {
      return animate.to(this.$el, 0.5, this.animationStates.out)
    }
  }
};

const Page2 = {
  template: `
    <div class="image">
      <h1>Page 2</h1>

      <little-thing v-ref="littlething" v-transition="animate-in-out"></little-thing>

      <p>Consectetur adipisicing elit, sed do <a v-link="'/page2'">a link to page 2 should also be active</a> eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  `,

  data () {
    return {
      animationStates: {
        initial: {xPercent: 50, opacity: 0},
        default: {xPercent: 0, opacity: 1},
        out: {xPercent: -50, opacity: 0}
      }
    }
  },

  methods: {
    animateIn () {
      return Promise.all([
        this.$.littlething.animateIn(),
        animate.fromTo(this.$el, 0.5, this.animationStates.initial, this.animationStates.default)])
    },

    animateOut () {
      return animate.to(this.$el, 0.5, this.animationStates.out)
    }
  },

  components: {
    'little-thing': LittleThing
  }
}

router.map({
  '/page1': {
    component: Page1
  },
  '/page2': {
    component: Page2
  }
})

domready(() => router.start(App, 'body'))
