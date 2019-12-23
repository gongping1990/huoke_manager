<template>
  <div class="p-learnList">
    <Card>
      <Row class="g-search">
        <Col :span="12" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">选择学科：</div>
            <RadioGroup v-model="selectInfo" @on-change="getList(1)" type="button">
              <Radio v-for="(item,index) in subjectList" :label="item.key" :key="index">{{item.name}}</Radio>
            </RadioGroup>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import Editor from "@/components/editor";
  import {pattern} from '@/libs/regexp'
  import UploadImg from "@/components/uploadImg";

  export default {
    name: 'friendHelp',
    components: {UploadImg, Editor},
    data() {
      return {
        subjectList: [
          {
            name: '语文',
            key: '1'
          },
          {
            name: '数学',
            key: '2'
          },
          {
            name: '英语',
            key: '3'
          }
        ],
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        selectInfo: localStorage.nowRadioType || '1',
        isFetching: false,
        isSending: false,
        addInfo: {},
        columns: [
          {
            title: '栏目名称',
            key: 'title',
            align: 'center'
          },
          {
            title: '下属栏目',
            render: (h,params)=> {
              return h('div', params.row.childLevel == '0' ? '无' : `${params.row.childLevel}级`)
            },
            align: 'center',
            key: 'creatTime'
          },
          {
            title: '操作',
            align: 'center',
            render:
              (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#5444E4'
                    },
                    on: {
                      click: () => {
                        this.goJump(params.row)
                      }
                    }
                  }, '文章管理')
                ])
              }
          }
        ]
      }
        ;
    },
    computed: {},
    mounted() {
      this.getList()
    },
    methods: {
      goJump(item1) {
        this.$router.push({
          name: 'hkywhd_column_act',
          query: {
            type: '2',
            level: item1.childLevel,
            subject: this.subjectList[this.selectInfo - 1].name,
            columnId: item1.id,
            columnName: item1.title
          }
        })
        localStorage.setItem('nowRadioType', this.selectInfo)
        localStorage.setItem('columnList', JSON.stringify(item1.children))
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.wzjh.columnList({
          subject: this.selectInfo,
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-learnList {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-c-tips {
      color: #39f
    }
  }
</style>
