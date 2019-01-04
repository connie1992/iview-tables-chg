import Example from './example/example';
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ChgTables from './components/index';

Vue.use(iView);
Vue.use(ChgTables);

new Vue({
    el: '#example',
    template: '<Example/>',
    components: { Example },
});
