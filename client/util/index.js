import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const toast = (msg = '', time = 1500) => {
  var toast = document.createElement('div')
  toast.className = 'common-toast common-toast-show'
  toast.innerHTML = msg
  document.body.appendChild(toast)
  toast.style.display = 'block'
  toast.style.margin = `-${toast.offsetHeight / 2}px 0 0 -${toast.offsetWidth / 2}px`
  var timer = setTimeout(() => {
    toast.className = 'common-toast common-toast-hide'
    clearTimeout(timer)
    var timer2 = setTimeout(() => {
      document.body.removeChild(toast)
      clearTimeout(timer2)
    }, 200)
  }, time)
}

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    console.log(response)
    if (!response.ok) {
      toast('加载失败')
    }
  })
})

export default {
  get (url, data = {}, success = () => { }, error = () => { }) {
    Vue.http.get(url, { params: data }).then((response) => {
      return response.json()
    }, error).then(success)
  },
  post (url, data = {}, success = () => { }, error = () => { }) {
    Vue.http.post(url, { body: data }).then((response) => {
      return response.json()
    }, error).then(success)
  },
    /**
     * 消息消失框
     */
  toast
}

