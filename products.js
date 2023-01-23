import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
import pagination from './component/pagination.js';
import { productModalComponent } from './component/product-modal.js';

const site = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'peihanwang-hexschool';

let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imageUrl: [],
      },
      isNew: false, // 確認是編輯或新增所使用
      page: {},
    };
  },
  components:{
    pagination,
    productModalComponent
  },
  methods: {
    checkAdmin() {
      //確認登入狀態，並執行相對應行為
      const url = `${site}api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'index.html';
        });
    },
    getProducts(page = 1) { // 預設參數 : 預設 1
      //取得產品資料
      const url = `${site}api/${api_path}/admin/products/?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
          console.log(res);
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(status, product) {
      if (status === 'create') {
        productModal.show();
        this.isNew = true;
        // 會帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === 'edit') {
        productModal.show();
        this.isNew = false;
        // 會帶入當前要編輯的資料
        this.tempProduct = { ...product };
      } else if (status === 'delete') {
        delProductModal.show();
        this.tempProduct = { ...product }; // 等等取 id 使用
      }
    },
    updateProducts() {
      //更新與新增產品
      let url = `${site}api/${api_path}/admin/product`;
      // 用 isNew 判斷 API 如何運行
      let method = 'post';
      if (!this.isNew) {
        url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }
      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          this.getProducts(); // 新增完產品以後會重新取得
          productModal.hide(); // 關閉 modal
        })
        .catch((err) => {
          // 新增產品失敗跳出錯誤訊息提示框
          alert(err.data.message);
        });
    },
    deleteProduct() {
      const url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then(() => {
          this.getProducts();
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    //取出 cookie 上儲存的 token
    //執行 proxy 上的 ckeckAdmin 方法，確認是否為登入成功的狀態
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexPeihanWangToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();

    // bootstrap 方法
    // 1.初始化 new
    // 2.呼叫方法 show / hide
    productModal = new bootstrap.Modal('#productModal');
    delProductModal = new bootstrap.Modal('#delProductModal');
  },
});

app.mount('#app');
