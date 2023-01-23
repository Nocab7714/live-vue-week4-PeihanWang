// 使用 import 的方式將 vue 的 createApp 的方法提取出來
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
      // signin api post 資料格式
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      // 儲存 signin 的 api 路徑
      const url = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      // 提出 post 請求
      // 傳送的資料為 api 路徑與 proxy 代理伺服器的 user 資料
      // 也就是剛剛在 input 的帳號密碼 username.value 和 password.value
      axios
        .post(url, this.user)
        // 成功狀態:
        // 先將儲存在 res.data 的 token 與 expired 解構出來，
        // 寫入 cookie token，
        // expire 設置有效時間 (unix timestamp 格式轉換)
        // 跳轉頁面至 products.html
        .then((res) => {
          const { token, expired } = res.data;
          // console.log(token, expired);
          document.cookie = `hexPeihanWangToken=${token};expire=${new Date(
            expired
          )};path=/`;
          window.location = 'products.html';
        })
        // 失敗狀態:
        // 失敗將 err.response.data 的錯誤訊息透過彈跳視窗顯示
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
}).mount('#app');
