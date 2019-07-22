import Example from './example/example';
import Vue from 'vue';
// import iView from 'iview';
import { Button, Table, Page } from 'iview';
import 'iview/dist/styles/iview.css';
import ChgTables from './components/index';

// Vue.use(iView);
Vue.component('Button', Button);
Vue.component('Table', Table);
Vue.component('Page', Page);
Vue.use(ChgTables);

new Vue({
    el: '#example',
    template: '<Example/>',
    components: { Example },
});
