<template>
  <div class="p-todayWork">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="radioType" type="button" @on-change="changeJobType">
            <Radio :label=0>待批改</Radio>
            <Radio :label=4>无需批改</Radio>
            <Radio :label=1>不合格</Radio>
            <Radio :label=3>已批改</Radio>
            <Radio :label=5>表扬</Radio>
          </Radio-group>
        </Row>
        <Row class="p-todayWork-flex" v-if="radioType === 0">
          <Col :span="4">
            <Card class="-item-wrap">
              <div class="-item-wrap-top">
                <div class="-name-left">作业总量</div>
                <Poptip placement="bottom" :transfer="true" trigger="hover" popper-class="p-todayWork-flex">
                  <div class="-name-right">明细</div>
                  <Row class="-mask-wrap" slot="content">
                    <Col class="-mask-wrap-item" :span="7" v-for="(item, index) of 3" :key="index">
                      <Card>
                        <div class="-mask-wrap-top">
                          <div class="-name-left">{{item.name}}</div>
                        </div>
                        <div class="-mask-wrap-center">{{item.num}}</div>
                        <div class="-mask-wrap-down">{{item.ratio}}</div>
                      </Card>
                    </Col>
                  </Row>
                </Poptip>
              </div>
              <div class="-item-wrap-center">{{countInfo.total}}/{{countInfo.totalHandled}}</div>
              <div class="-item-wrap-down">{{(countInfo.totalHandled/countInfo.total).toFixed(3)*100}}%</div>
            </Card>
          </Col>

          <Col :span="4">
            <Card class="-item-wrap">
              <div class="-item-wrap-top">
                <div class="-name-left">重交</div>
              </div>
              <div class="-item-wrap-center">{{countInfo.resubmitnum}}/{{countInfo.handleResubmit}}</div>
              <div class="-item-wrap-down">{{(countInfo.handleResubmit/countInfo.resubmitnum).toFixed(3)*100}}%</div>
            </Card>
          </Col>

        </Row>

        <Row v-if="radioType === 1 || radioType === 2" class="-p-margin-top g-t-left">
          <Radio-group v-model="unqualifiedType" type="button" @on-change="changeUnqualified()">
            <Radio :label=1>未重做</Radio>
            <Radio :label=2>已重交</Radio>
          </Radio-group>
        </Row>

        <search-template ref="searchChild" :option="searchOption" @changeSearch="getSearchInfo"></search-template>

        <Row v-if="(radioType === 1 && unqualifiedType === 1) || radioType === 4" class="p-todayWork-tip">
          <div class="-tip-div g-t-left">
            <Checkbox v-model="selectAllData" @on-change="changeAloneSelect">全选所有作业</Checkbox>
          </div>
          <div class="-tip-div g-text-right">
            <Button @click="sendMessage()" ghost type="primary" style="width: 100px;">{{radioType === 4 ? '移入待批改' :
              '提醒'}}
            </Button>
          </div>
        </Row>
      </Row>

      <Table :loading="isFetching" :columns="columsType[radioType]" :data="dataList" ref="selection"
             @on-selection-change="changeSelectData"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-todayWork"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="750"
        title="批改作业">
        <Form ref="addInfo" :model="addInfo" :label-width="90">
          <FormItem label="是否合格">
            <Radio-group v-model="addInfo.isPassed" @on-change="changePassed">
              <Radio :label=1>合格</Radio>
              <Radio :label=0>不合格</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="教师名称" prop="replyTeacher" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.replyTeacher" placeholder="请输入教师名称"></Input>
          </FormItem>
          <FormItem label="批改图片" v-if="addInfo.isPassed === 1">
            <div class="p-todayWork-formItem" v-if="addInfo.homeworkType === 2">
              <div class="g-course-add-style" @click="openPictures">
                <span>+</span>
                <span>进入在线批改</span>
              </div>
              <div class="g-course-add-style" @click="viewWork(addInfo)">
                <span>+</span>
                <span>获取批改图片</span>
              </div>
            </div>
            <upload-img-multiple v-model="addInfo.replyImg" :option="uploadOption"></upload-img-multiple>
          </FormItem>
          <FormItem label="批改音频" v-if="addInfo.isPassed === 1">
            <upload-audio ref="childAudio" v-model="addInfo.replyAudio" :option="uploadAudioOption"
                          @otherAudioInfo="getAudioInfo"></upload-audio>
          </FormItem>
          <FormItem label="批改文案" :class="{'ivu-form-item-required': addInfo.isPassed === 0}">
            <Input type="textarea" :rows="5" v-model="addInfo.replyText" placeholder="请输入批改文案"></Input>
          </FormItem>
          <FormItem label="综合评分" v-if="addInfo.isPassed === 1" :class="{'ivu-form-item-required': addInfo.isPassed === 1}">
            <p class="-c-tips">此评分主要用于其他老师在查看作业记录时，能快速的对用户的作业情况有一个大致的了解，用户不可见</p>
            <div class="p-todayWork-score">
              <div class="p-todayWork-scoreItem" v-for="(item, index) of addInfo.scores" :key="index">
                <span>{{item.name}}</span>
                <InputNumber class="-input" type="text" v-model="item.score" placeholder="满分一百分"></InputNumber>
              </div>
            </div>

          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
        </div>
      </Modal>

      <Modal
        class="p-todayWork"
        v-model="isOpenModalPlay"
        @on-cancel="closeModalPlay"
        footer-hide
        width="350"
        title="播放">
        <audio ref="playAudio" :src="playAudioUrl" controls></audio>
      </Modal>

      <examine-modal v-model="isOpenModalAuit" :dataInfo="detailInfo" @successAudit="successAudit"></examine-modal>

      <job-record-template v-model="isOpenJobRecord" :dataInfo="recordInfo"></job-record-template>

      <look-user-info v-model="isOpenUserInfo" :dataInfo="detailInfo"></look-user-info>

      <job-require-template v-model="isOpenJobRequire" :dataInfo="requireInfo"></job-require-template>

    </Card>
  </div>
</template>

<script>
  import {getVisitUrl} from '@/libs/index'
  import UploadAudio from "../../../components/uploadAudio";
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'
  import UploadImgMultiple from "../../../components/uploadImgMultiple";
  import SearchTemplate from "../../../components/searchTemplate";
  import JobRecordTemplate from "../../../components/jobRecordTemplate";
  import LookUserInfo from "./lookUserInfo";
  import ExamineModal from "./examineModal";
  import JobRequireTemplate from "./jobRequireTemplate";

  export default {
    name: 'jobList',
    components: {
      JobRequireTemplate,
      ExamineModal,
      LookUserInfo, JobRecordTemplate, SearchTemplate, UploadImgMultiple, DatePickerTemplate, UploadAudio},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        searchOption: {
          isAppId: true,
          isWorkType: true,
          isPay: true,
          isUserType: true
        },
        evaluateColumn: {
          '0': '不满意',
          '1': '一般',
          '2': '满意',
        },
        dataList: [],
        selectUserList: [],
        total: 0,
        radioType: +localStorage.todayWork_type || 0,
        unqualifiedType: 1,
        getStartTime: '',
        getEndTime: '',
        noticeMessage: '',
        selectAllData: false,
        searchInfo: {},
        isFetching: false,
        isOpenModal: false,
        isOpenModalPlay: false,
        isOpenJobRecord: false,
        isOpenUserInfo: false,
        isOpenModalAuit: false,
        isOpenJobRequire: false,
        isEdit: false,
        addInfo: {},
        detailInfo: {},
        requireInfo: {},
        countInfo: {},
        recordInfo: {},
        playAudioUrl: '',
        columns: [
          {
            title: '用户昵称',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toDetail(params.row)
                  }
                }
              }, params.row.nickName)
            },
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'lessonName',
            align: 'center',
            tooltip:true
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            render: (h, params)=>{
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openRequire(params.row)
                  }
                }
              }, `${params.row.homeworkRequire.substr(0,5)}...`)
            },
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
              ])
            },
            align: 'center'
          },
          {
            title: '提交时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 270,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.noRequired(params.row)
                    }
                  }
                },'无需批改'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, params.row.reviewStatus == '1' ? '审核' : '批改'),
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small'
                //   },
                //   style: {
                //     color: '#5444E4',
                //     display: params.row.homeworkType === 1 ? 'none' : 'inline-block',
                //     marginRight: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.toPictures(params.row)
                //     }
                //   }
                // },'批改图片'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '用户昵称',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toDetail(params.row)
                  }
                }
              }, params.row.nickName)
            },
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            render: (h, params)=>{
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openRequire(params.row)
                  }
                }
              }, `${params.row.homeworkRequire.substr(0,8)}...`)
            },
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
              ])
            },
            align: 'center'
          },
          {
            title: '提交时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '批改时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.replyTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '评价内容',
            key: 'evaluationText',
            align: 'center'
          },
          {
            title: '操作',
            width: 360,
            align: 'left',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '修改评价'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: params.row.homeworkType === 1 ? 'none' : 'inline-block',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editPictures(params.row)
                    }
                  }
                }, '修改图片'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openJobRecord(params.row)
                    }
                  }
                }, '作业记录'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: this.radioType == 5 ? 'none' : 'inline-block',
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.jobPrise(params.row)
                    }
                  }
                }, this.radioType == '5' ? '移出表扬' : '加入表扬')
              ])
            }
          }
        ],
        columnsThree: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户昵称',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toDetail(params.row)
                  }
                }
              }, params.row.nickName)
            },
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            render: (h, params)=>{
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openRequire(params.row)
                  }
                }
              }, `${params.row.homeworkRequire.substr(0,8)}...`)
            },
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
              ])
            },
            align: 'center'
          },
          {
            title: '提交时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '批改时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.replyTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 260,
            align: 'left',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '修改评价'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openJobRecord(params.row)
                    }
                  }
                }, '作业记录'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columnsFour: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户昵称',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toDetail(params.row)
                  }
                }
              }, params.row.nickName)
            },
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.buyStatus ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '作业要求',
            key: 'homeworkRequire',
            render: (h, params)=>{
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openRequire(params.row)
                  }
                }
              }, `${params.row.homeworkRequire.substr(0,8)}...`)
            },
            align: 'center'
          },
          {
            title: '作业内容',
            width: 200,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-around'
                }
              }, params.row.homeworkType == '2' ? params.row.workImgSrc.map((item, index) => {
                return h('div', {
                  style: {
                    position: 'relative',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: item,
                      preview: '0'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px',
                      cursor: 'zoom-in'
                    }
                  }), h('Icon', {
                    props: {
                      type: 'md-download'
                    },
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      right: '10px',
                      fontSize: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        window.open(item.split('?')[0])
                      }
                    }
                  })
                ])
              }) : [
                h('div', {
                  style: {
                    textAlign: 'center',
                    color: '#5444E4',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.openModalPlay(params.row.workAudio)
                    }
                  }
                }, '播放音频')
              ])
            },
            align: 'center'
          },
          {
            title: '提交时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.submitTime).format('YYYY-MM-DD HH:mm'))
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
      };
    },
    computed: {
      columsType() {
        return {
          '0': this.columns,
          '3': this.columnsTwo,
          '4': this.columnsFour,
          '1': this.columnsThree,
          '2': this.columnsThree,
          '5': this.columnsTwo,
        }
      }
    },
    mounted() {
      this.todayWorkJobCount()
      this.getTeacherRemind()
    },
    methods: {
      openPictures () {
        window.open(`${getVisitUrl()}/#/correct?system=${this.searchInfo.system}&courseId=${this.addInfo.courseId}&workId=${this.addInfo.workId}`,'_blank');
      },
      editPictures (data) {
        this.$Modal.confirm({
          title: '确认要修改图片吗？',
          content: '修改图片后，修改后的图片会替换掉之前的批改图片',
          onOk: () => {
            this.toPictures(data)
          }
        })
      },
      toPictures (data) {
        this.$router.push({
          name: 'correct',
          query: {
            system: this.searchInfo.system,
            courseId: data.courseId,
            workId: data.workId
          }
        })
      },
      noRequired(data) {
        this.$Modal.confirm({
          title: '提示',
          content: this.radioType === 4? '确认将该作业移入待批改' : '确认移出到无需批改？',
          onOk: () => {
            let paramUrl = ''
            if (this.radioType === 0 ) {
              paramUrl = this.$api.jsdJob.replyHomework({
                courseId: this.searchInfo.appId,
                id: data.workId,
                status: 4
              })
            } else {
              paramUrl = this.$api.jsdJob.moveNOReplyHomework({
                courseId: this.searchInfo.appId,
                workIds: [data.workId],
                range: this.selectAllData ? 1 : 0,
              })
            }
            paramUrl.then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      toDetail(data) {
        this.isOpenUserInfo = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
      },
      changeAloneSelect() {
        this.$refs.selection.selectAll(this.selectAllData);
      },
      changeSelectData(data) {
        this.selectUserList = []
        for (let item of data) {
          this.selectUserList.push(item.workId)
        }
      },
      sendMessage() {
        if (!this.selectUserList.length) {
          return this.$Message.error('请选择需要操作的用户')
        }
        let tipText = this.radioType === 4 ? `确认将${this.selectAllData ? '所有' : `选中的${this.selectUserList.length}份`}作业移入待批改？` : `确认向${this.selectAllData ? '所有' : `选中的${this.selectUserList.length}位`}用户发送微信消息和短信？`
        this.$Modal.confirm({
          title: '提示',
          content: tipText,
          onOk: () => {
            let paramUrl = ''
            if (this.radioType === 4) {
              paramUrl = this.$api.jsdJob.moveNOReplyHomework
            } else {
              paramUrl = this.$api.jsdJob.remindReSubmit
            }
            paramUrl({
              range: this.selectAllData ? 1 : 0,
              courseId: this.searchInfo.appId,
              workIds: this.selectAllData ? [] : this.selectUserList
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      jobPrise(param) {
        this.$Modal.confirm({
          title: '提示',
          content: `确认要${this.radioType == 5 ? '移出表扬' : '加入表扬'}？`,
          onOk: () => {
            this.$api.jsdJob.praise({
              courseId: this.searchInfo.appId,
              praise: this.radioType === 3,
              id: param.workId
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      changeJobType() {
        localStorage.setItem('todayWork_type', this.radioType)
        if (this.radioType === 1) {
          this.noticeText()
        }
        // this.searchInfo = {}
        setTimeout(() => {
          this.$refs.searchChild.initSearch()
        }, 100);

        if (this.radioType === 3 || this.radioType === 5) {
          this.searchOption = {
            isAppId: true,
            isWorkType: true,
            isPay: true,
            isUserType: true,
            isComment: true,
            isSituation: true,
            isFeedback: true
          }
        } else {
          this.searchOption = {
            isAppId: true,
            isWorkType: true,
            isPay: true,
            isUserType: true
          }
        }
        this.getList(1)
      },
      changeUnqualified() {
        // this.noticeText()
        // this.searchInfo = {}
        setTimeout(() => {
          this.$refs.searchChild.initSearch()
        }, 100);
        this.radioType = this.unqualifiedType
        this.getList(1)
      },
      noticeText() {
        if (this.noticeMessage) {
          this.$Notice.warning({
            desc: this.noticeMessage,
            duration: 5
          });
        }
      },
      getTeacherRemind() {
        this.$api.jsdJob.getTeacherRemind()
          .then(
            response => {
              this.noticeMessage = response.data.resultData;
            })
      },
      getSearchInfo(data) {
        this.searchInfo = data
        console.log(data, '000')
        this.getList(1)
      },
      getAudioInfo(data) {
        this.addInfo.replyDuration = (data / 1000).toFixed()
      },
      changePassed() {
        this.$forceUpdate()
      },
      openModalPlay(data) {
        this.playAudioUrl = data
        this.isOpenModalPlay = true
      },
      openRequire (data) {
        this.isOpenJobRequire = true
        this.requireInfo = JSON.parse(JSON.stringify(data))
        this.requireInfo.appId = this.searchInfo.appId
      },
      openJobRecord(data) {
        this.isOpenJobRecord = true
        this.recordInfo = JSON.parse(JSON.stringify(data))
        this.recordInfo.appId = this.searchInfo.appId
      },
      closeModalPlay() {
        this.$refs.playAudio.load()
        this.isOpenModalPlay = false
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.jsdJob.removeHomework({
              courseId: this.searchInfo.appId,
              id: param.workId
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      successAudit (data) {
        this.getList(1)
        if (data.reviewStatus === 3) {
          this.openModal(data)
        }
      },
      openModal(data) {

        if (data.reviewStatus === 1) {
          this.detailInfo = JSON.parse(JSON.stringify(data))
          this.detailInfo.appId = this.searchInfo.appId
          this.isOpenModalAuit = true
        } else {
          this.isOpenModal = true
        }

        this.addInfo = {
          replyImg: [],
          replyText: '',
          replyAudio: ''
        }
        if (data) {
          this.viewWork(data)
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      todayWorkJobCount() {
        this.$api.jsdJob.todayWorkJobCount()
          .then(response => {
            this.countInfo = response.data.resultData;
            this.countInfo.otherList = [
              {
                name: '自动分配',
                num: `${this.countInfo.autonum}/${this.countInfo.autoHandled}`,
                ratio: `${(this.countInfo.autoHandled / this.countInfo.autonum) * 100}%`
              },
              {
                name: '补批',
                num: `${this.countInfo.oldnum}/${this.countInfo.oldHandled}`,
                ratio: `${(this.countInfo.oldHandled / this.countInfo.oldnum) * 100}%`
              },
              {
                name: '调度',
                num: `${this.countInfo.allotnum}/${this.countInfo.allotHandled}`,
                ratio: `${(this.countInfo.allotHandled / this.countInfo.allotnum) * 100}%`
              }
            ]
          })
      },
      viewWork(data) {
        this.$api.jsdJob.viewWork({
          system: this.searchInfo.system,
          workId: data.workId
        })
          .then(response => {
            let _self = this
            _self.addInfo = response.data.resultData
            _self.addInfo.isPassed = _self.radioType != 1 ? 1 : 0
            _self.addInfo.workImgSrc = _self.addInfo.workImgSrc ? _self.addInfo.workImgSrc.split(',') : []
            _self.addInfo.replyImgTmp = _self.addInfo.replyImgTmp ? _self.addInfo.replyImgTmp.split(',') : []
            _self.addInfo.replyImg = _self.addInfo.replyImg ? _self.addInfo.replyImg.split(',') : []
            _self.addInfo.replyImg = _self.addInfo.replyImg.length ? _self.addInfo.replyImg.concat(_self.addInfo.replyImgTmp) : _self.addInfo.replyImgTmp
            _self.$forceUpdate()
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.searchInfo.appId,
          evaluation: this.searchInfo.evaluation == '-1' ? '' : this.searchInfo.evaluation,
          payed: this.searchInfo.pay == '-1' ? '' : this.searchInfo.pay,
          evaluationed: this.searchInfo.evaluationed == '-1' ? '' : this.searchInfo.evaluationed,
          hasComment: this.searchInfo.hasComment == '-1' ? '' : this.searchInfo.hasComment,
          hmBegin: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          hmEnd: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : "",
          status: this.radioType == 5 ? '' : this.radioType
        }

        if (this.searchInfo.workType == '1' && this.searchInfo) {
          params.lname = this.searchInfo.manner
        } else if (this.searchInfo.workType == '2' && this.searchInfo) {
          params.hmkeyword = this.searchInfo.manner
        }

        if (this.searchInfo.userType == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.mannerTwo
        } else if (this.searchInfo.userType == '2' && this.searchInfo) {
          params.phone = this.searchInfo.mannerTwo
        }

        if (this.radioType == 5) {
          params.praise = true
        }

        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.jsdJob.listTeacherWorkByPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
              for (let item of this.dataList) {
                item.workImgSrc = item.workImgSrc ? item.workImgSrc.split(',') : []
                item.replyImg = item.replyImg ? item.replyImg.split(',') : []
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        let passContent = this.addInfo.scores.every((item) => {
          return (item.score != null && item.score < 100)
        })

        if (!this.addInfo.replyTeacher) {
          return this.$Message.error('请输入教师名称')
        } else if (this.addInfo.replyImg.length > 3) {
          return this.$Message.error('最多上传三张图片')
        } else if (!this.addInfo.replyText && this.addInfo.isPassed === 0) {
          return this.$Message.error('请输入不合格评语')
        }

        if (!passContent) {
          return this.$Message.error('每一项评分不能超过100分并且不能为空')
        }

        this.$api.jsdJob.replyHomework({
          id: this.addInfo.workId,
          courseId: this.searchInfo.appId,
          replyImg: `${this.addInfo.replyImg}`,
          replyTeacher: this.addInfo.replyTeacher,
          replyText: this.addInfo.replyText,
          replyAudio: this.addInfo.replyAudio,
          replyDuration: this.addInfo.replyDuration,
          evaluate: this.addInfo.scores,
          status: this.addInfo.isPassed == 1 ? '3' : '1'
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.closeModal(name)
              }
            })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-todayWork {

    &-formItem {
      position: absolute;
      left: 160px;
      display: flex;

      .g-course-add-style {
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }

    &-flex {
      display: flex;
      margin-top: 20px;

      .-item-wrap {
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;

        &-top {
          display: flex;
          justify-content: space-between;

          .-name-left {
            font-size: 16px;
          }

          .-name-right {
            cursor: pointer;
            font-weight: normal;
            color: #5444e4;
          }
        }

        &-center {
          margin: 2px 0;
          font-size: 18px;
          display: flex;
          justify-content: center;
        }
      }

      .-mask-wrap {
        display: flex;
        justify-content: space-between;
        width: 580px;
        margin: 20px 0;
        font-size: 14px;
        font-weight: bold;

        &-top {
          .-name-left {
            font-size: 16px;
          }
        }

        &-center {
          margin: 2px 0;
          font-size: 18px;
          display: flex;
          justify-content: center;
        }

        &-down {
          text-align: center;
        }
      }
    }

    &-tip {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 20px;

      .-tip-div {
        width: 50%;
      }
    }

    &-score {
      display:flex;
      flex-direction:row;
      flex-wrap:wrap;
    }

    &-scoreItem {
      display: flex;
      align-items: center;
      margin-top: 10px;
      width: 50%;

      span{
        text-align: right;
        display: inline-block;
        width:40%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .-input {
        width:50%;
        margin-left: 10px;
      }
    }

    .-c-tips {
      color: #3399FF
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      margin-top: 20px;
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-p-margin-top {
      margin-top: 20px;
    }
  }
</style>
