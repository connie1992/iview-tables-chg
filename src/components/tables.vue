<style>
    .ivu-table .table-selected-row td {
        background-color: #e0eefd
    }

    .ivu-table-small .ivu-table-row td {
        height: 32px
    }

    #refreshBtn .ivu-icon {
        line-height: 1.0;
    }

    .ivu-page.mini .ivu-page-options-elevator input {
        height: 22px;
    }
</style>
<template>
    <div id="tableID">
        <Table
                :data="tableData"
                :columns="columns"
                :stripe="stripe"
                :border="border"
                :show-header="showHeader"
                :width="width"
                :height="height"
                :max-height="maxHeight"
                :loading="loading"
                :disabled-hover="disabledHover"
                :highlight-row="highlightRow"
                :row-class-name="rowClassName"
                :size="size"
                :no-data-text="noDataText"
                :no-filtered-data-text="noFilteredDataText"
                @on-current-change="onCurrentChange"
                @on-select="onSelect"
                @on-select-cancel="onSelectCancel"
                @on-select-all="onSelectAll"
                @on-selection-change="onSelectionChange"
                @on-sort-change="onSortChange"
                @on-filter-change="onFilterChange"
                @on-row-click="onRowClick"
                @on-row-dblclick="onRowDblclick"
                @on-expand="onExpand">
            <slot name="header" slot="header"></slot>
            <slot name="footer" slot="footer"></slot>
            <slot name="loading" slot="loading"></slot>
            <template v-for="item in columns" :v-if="item.slot != undefined && item.key == undefined" slot-scope="{row, index}" :slot="item.slot">
                <slot :name="item.slot" :data="{row, index}"></slot>
            </template>
        </Table>
        <div v-if="showPage" style="padding-top: 8px;display: flex;justify-content: flex-end" ref="pagerDiv">
            <Page show-sizer :show-elevator="showElevator" :page-size-opts="pagerPageSizeOpts" size="small"
                  :total="total" :current="current" :page-size="pageSize"
                  @on-change="changePage" @on-page-size-change="changePageSize"/>
            <div id="refreshBtn" style="margin-right: 8px">
                <Button customIcon="iconfont icon-shuaxin1"
                        size="small"
                        @click="refresh"></Button>
            </div>
            <div :style="{fontSize: sizeTextFontSize,display: 'flex', alignItems: 'center'}">{{sizeText}}</div>
        </div>
        <div v-if="!showPage && showTotalDesc" style="padding-top: 18px; text-align: right" ref="pagerDiv">
            <label :style="{fontSize: sizeTextFontSize}">共{{tableData.length}}条数据</label>
        </div>
    </div>
</template>


<script>
  import util from '@/libs/util';
  import '../assets/iconfont/iconfont.css';

  export default {
    name: 'ChgTables',
    props: {
      propData: {
        type: Array,
        default() {
          return [];
        }
      },
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      showIndex: {
        type: Boolean,
        default: false
      },
      showSelection: {
        type: Boolean,
        default: false
      },
      showPage: {
        type: Boolean,
        default: true
      },
      showTotalDesc: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'small'
      },
      width: {
        type: [Number, String],
        default: 'auto'
      },
      height: {
        type: [Number, String]
      },
      maxHeight: {
        type: [Number, String]
      },
      stripe: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      highlightRow: {
        type: Boolean,
        default: false
      },
      context: {
        type: Object
      },
      noDataText: {
        type: String
      },
      noFilteredDataText: {
        type: String
      },
      disabledHover: {
        type: Boolean
      },
      loading: {
        type: Boolean,
        default: false
      },
      total: {
        type: Number,
        default: 0
      },
      sizeTextFontSize: {
        type: String,
        default: '14px'
      },
      pagerPageSize: {
        type: Number,
        default: 50
      },
      pagerPageSizeOpts: {
        type: Array,
        default() {
          return [20, 50, 80, 100];
        }
      },
      indexWidth: {
        type: Number,
        default: 60
      },
      showElevator: {
        type: Boolean,
        default: false
      }
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data() {
      return {
        current: 1,
        pageSize: 50,
        sortKey: '',
        sortType: '',
        tableData: [],
        // 已选择的数据行
        selects: []
      };
    },
    computed: {
      sizeText: function () {
        let end = this.current * this.pageSize;
        end = end > this.total ? this.total : end;
        let start = end == 0 ? 0 : (this.current - 1) * this.pageSize + 1;
        return `当前${start}~${end}，共${this.total}条`;
      },
    },
    watch: {
      propData: function (newList) {
        // 重置已选择的行数据
        this.selects = [];
        this.tableData = util.copyObject(newList);
        this.tableData.forEach((item) => {
          this.$set(item, '_checked', false);
        });
      }
    },
    methods: {
      rowClassName(row) {
        if (this.showSelection) {
          if (row._checked) {
            return 'table-selected-row';
          }
          return '';
        } else {
          return '';
        }
      },
      onCurrentChange(currentRow, oldCurrentRow) {
        this.$emit('on-current-change', currentRow, oldCurrentRow);
      },
      onSelect(selection, row) {
        this.$emit('on-select', selection, row);
      },
      onSelectCancel(selection, row) {
        this.$emit('on-select-cancel', selection, row);
      },
      onSelectAll(selection) {
        this.$emit('on-select-all', selection);
      },
      // 点击多选框时触发事件
      onSelectionChange(selection) {
        this.selects = selection;
        this.tableData.forEach((item) => {
          // 根据选中的数据来设置整个表格每行数据的_checked属性
          let temp = selection.filter(item1 => item1.id == item.id);
          if (temp && temp.length > 0) {
            item._checked = true;
          } else {
            item._checked = false;
          }
        });
        this.$emit('on-selection-change', selection);
      },
      onSortChange(column) {
        this.sortKey = column.key;
        this.sortType = column.order;
        this.refresh();
      },
      onFilterChange(row) {
        this.$emit('on-filter-change', row);
      },
      onRowClick(row, index) {
        // 设置数据行的check属性，触发表格选中
        if (this.showSelection) {
          this.tableData[index]._checked = !this.tableData[index]._checked;
        }
        // 设置目前选中的数据行数组
        row._checked = !row._checked;
        if (this.showSelection) {
          if (row._checked) {
            // 选中的话直接加入
            this.selects.push(row);
          } else {
            // 取消选中的话需要从已选中的列表中过滤出该行
            let filters = this.selects.filter(item => item.id != row.id);
            this.selects = filters;
          }
        } else {
          this.selects = [];
          if (row._checked) {
            this.selects.push(row);
          }
        }
        this.$emit('on-row-click', row, index);
      },
      onRowDblclick(row, index) {
        this.$emit('on-row-dblclick', row, index);
      },
      onExpand(row, status) {
        this.$emit('on-expand', row, status);
      },
      // 页码跳转
      changePage(pageIndex) {
        if (this.current != pageIndex) {
          this.current = pageIndex;
          this.refresh();
        } else {
          console.log('这是由于每页显示大小改变触发的……');
        }
      },
      // 修改每页显示的行数
      changePageSize(pageSize) {
        this.current = 1;
        this.pageSize = pageSize;
        this.refresh();
      },
      getParams() {
        let params = {
          pageSize: this.pageSize, pageIndex: this.current - 1, sortKey: this.sortKey, sortType: this.sortType,
          pageStart: this.pageSize * (this.current - 1), pageEnd: this.current * this.pageSize
        };
        return params;
      },
      search() {
        this.current = 1;
        this.refresh();
      },
      getSelects() {
        return this.selects;
      },
      refresh() {
        this.$emit('load-data');
      }
    },
    created() {
      this.pageSize = this.pagerPageSize;
      if (this.showIndex && (this.columns.length == 0 || (this.columns.length > 0 && (this.columns[0].type != 'index' || (this.columns[1] && this.columns[1].type != 'index'))))) {
        let indexParam = {
          type: 'index',
          width: this.indexWidth,
          align: 'center',
          indexMethod: (row) => {
            return this.pageSize * (this.current - 1) + row._index + 1;
          },
          // 原来是的序号表头会显示#，自定义成自己想要的文字显示
          renderHeader: (h) => {
            return h('span', '序号');
          }
        };
        // 判断有没有左边固定列的情况
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].fixed === 'left') {
            indexParam.fixed = 'left';
            break;
          }
        }
        this.columns.unshift(indexParam);
      }
      if (this.showSelection) {
        this.columns.unshift({
          width: 50, type: 'selection', align: 'center'
        });
      }
    },
    mounted() {

    }
  };
</script>

