<template>
    <div id="example" style="margin: 50px;width: 1000px">
        <div style="padding: 10px">使用查询：<Button type="primary" @click="search" size="small">查询</Button></div>
        <ChgTables ref="demoTable" show-index show-selection :loading="loading" :columns="column" :total="total"
                :prop-data="data" height="500px" size-text-font-size="12px"
                :pager-page-size="20" :pager-page-size-opts="[10, 20, 30]" @load-data="getData"></ChgTables>
    </div>
</template>

<script>
    export default {
        name: "example",
        data() {
            return {
                data: [],
                total: 0,
                loading: false,
                column: [
                    {
                        title: '姓名',
                        key: 'name',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'phone',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '地址',
                        key: 'address',
                        align: 'center'
                    },
                ]
            }
        },
        methods: {
            getData() {
                this.loading = true;
                // 获取参数
                let params = this.$refs.demoTable.getParams();
                setTimeout(()=> {
                   this.loading = false;
                   this.data = [
                       {
                           id: 'dfsdadgsd',
                           name: '张三',
                           phone: '15678568930',
                           address: '北京理工大学'
                       },
                       {
                           id: 'dfsdadgs65756d',
                           name: '李四',
                           phone: '15678568930',
                           address: '北京科技大学'
                       },
                       {
                           id: 'dfsdad547gsd',
                           name: '王五',
                           phone: '15678568930',
                           address: '清华大学'
                       }
                   ];
                   this.total = 200;
                }, 300);
            },
            search(){
                this.$refs.demoTable.search();
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
