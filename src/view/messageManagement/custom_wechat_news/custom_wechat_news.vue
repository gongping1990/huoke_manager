<!-->
自定义微信模板消息推送管理页面
<-->
<template>
    <div class="p-wx">
        <el-row class="-wx-top">
            <div>
                <el-radio-group v-model="radioType" size="mini" @change="changeRadio">
                    <el-radio-button label="1">任务列表</el-radio-button>
                    <el-radio-button label="2">模板列表</el-radio-button>
                </el-radio-group>
            </div>
        </el-row>

        <el-row v-show="radioType == 1">
            <el-col :span="7">任务状态：
                <el-select style="width: 100px;" v-model="form.state" placeholder="请选择" size="mini"
                           @change="getCustomWxList">
                    <el-option label="全部" value="4"></el-option>
                    <el-option label="已完成" value="1"></el-option>
                    <el-option label="未发送" value="3"></el-option>
                    <el-option label="已撤销" value="2"></el-option>
                </el-select>
            </el-col>
            <el-col :span="17" class="-p-text-right">
                <span class="-p-span-text">发送时间：</span>
                <div class="-p-time">
                    <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择日期" size="mini"
                                    style="width: 100%">

                    </el-date-picker>
                </div>
                <span class="-p-span-text">至</span>
                <div class="-p-time">
                    <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期" size="mini"
                                    style="width: 100%">

                    </el-date-picker>
                </div>
                <el-button @click="getCustomWxList" size="small" type="primary" class="-p-modal-btn">查询</el-button>
            </el-col>

        </el-row>

        <div v-if="radioType == 1">
            <el-table :data="smsList" style="width: 100%" class="-p-tab">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="gmtCreate" label="创建时间" width="90" align="center"></el-table-column>
                <el-table-column prop="sendTime" label="发送时间" width="90" align="center"></el-table-column>
                <el-table-column prop="count" label="接收用户" align="center"></el-table-column>
                <el-table-column prop="successNum" label="发送成功" align="center"></el-table-column>
                <el-table-column prop="failNum" label="发送失败" align="center"></el-table-column>
                <el-table-column prop="content" label="消息内容">
                    <template slot-scope="scope">
                        <pre>{{scope.row.content}}</pre>
                    </template>
                </el-table-column>
                <el-table-column label="任务状态" align="center">
                    <template slot-scope="scope">
                        {{taskStatus[scope.row.status]}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.status==1" @click="openModal(scope.row.id)">发送记录
                        </el-button>
                        <el-button type="text" v-if="scope.row.status==3" @click="delCustomWechat(scope.row.id)">
                            撤销
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page.sync="tab.page"
                :page-size="tab.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="smsListTotal" background>
            </el-pagination>
        </div>

        <div v-if="radioType == 2">
            <wx-template></wx-template>
        </div>

        <el-dialog title="发送记录" :visible.sync="isOpenModal" width="1100px">
            <el-row>
                <el-col :span="7">发送状态：
                    <el-select style="width: 100px;" v-model="formRecord.state" placeholder="请选择" size="mini"
                               @change="getSmsMessageList">
                        <el-option label="全部" value="3"></el-option>
                        <el-option label="发送成功" value="1"></el-option>
                        <el-option label="发送失败" value="0"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="17">
                    <span class="-p-span-text">发送时间：</span>
                    <div class="-p-time">
                        <el-date-picker v-model="formRecord.startTime" type="datetime" placeholder="选择日期" size="mini"
                                        style="width: 100%">

                        </el-date-picker>
                    </div>
                    <span class="-p-span-text">至</span>
                    <div class="-p-time">
                        <el-date-picker v-model="formRecord.endTime" type="datetime" placeholder="选择日期" size="mini"
                                        style="width: 100%">

                        </el-date-picker>
                    </div>
                    <el-button @click="getSmsMessageList" size="small" type="primary" class="-p-modal-btn">查询
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="smsRecordList" style="width: 100%" class="-p-modal-tab">
                <el-table-column prop="creatTime" label="发送时间" width="100" align="center"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
                <el-table-column label="发送内容">
                    <template slot-scope="scope">
                        <pre>{{scope.row.content}}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="链接地址" align="center"></el-table-column>
                <el-table-column label="发送状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status ? '发送成功' : '发送失败'}}
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="sizeChangeRecord"
                @current-change="currentChangeRecord"
                :current-page.sync="tab.page"
                :page-size="tab.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="smsRecordListTotal" background>
            </el-pagination>
        </el-dialog>

    </div>
</template>

<script>
    import wxTemplate from "@/view/news_manage/wechat_template_list"
    import {getNowFormatDate} from "@/utils/date";
    import qs from "qs";

    export default {
        components: {wxTemplate},
        data() {
            return {
                tab: {
                    page: 1,
                    pageSize: 10
                },
                tabRecord: {
                    page: 1,
                    pageSize: 10
                },
                form: {
                    startTime: '',
                    endTime: '',
                    state: '4'
                },
                formRecord: {
                    startTime: '',
                    endTime: '',
                    state: '3'
                },
                radioType: '1',
                smsList: [],
                wxModalList: [],
                smsRecordList: [],
                smsListTotal: 0,
                smsRecordListTotal: 0,
                isOpenModal: false,
                nowSmsId: '',
                taskStatus: {
                    // '0': '发送失败',
                    '1': '已完成',
                    '2': '已撤销',
                    '3': '未发送'
                }
            };
        },
        mounted() {
            this.getCustomWxList()
        },
        methods: {
            sizeChange(val) {
                this.tab.page = 1;
                this.tab.pageSize = val;
                this.getCustomWxList();
            },
            sizeChangeRecord(val) {
                this.tabRecord.page = 1;
                this.tabRecord.pageSize = val;
                this.getSmsMessageList();
            },
            currentChange(val) {
                this.tab.page = val;
                this.getCustomWxList();
            },
            currentChangeRecord(val) {
                this.tabRecord.page = val;
                this.getSmsMessageList();
            },

            //分页查询
            getCustomWxList() {
                this.$http
                    .get(this.$store.state.baseUrl + "/user/listWxSendTask", {
                        params: {
                            current: this.tab.page,
                            size: this.tab.pageSize,
                            status: this.form.state,
                            sendTimeBegin: this.form.startTime ? getNowFormatDate(this.form.startTime) : "",
                            sendTimeEnd: this.form.endTime ? getNowFormatDate(this.form.endTime) : ""
                        }
                    })
                    .then(response => {
                        this.smsList = response.data.resultData.records;
                        this.smsListTotal = response.data.resultData.total;
                    })
                    .catch(error => {
                        console.log(error, "错误");
                    });
            },

            openModal(wxId) {
                this.nowSmsId = wxId
                this.isOpenModal = true
                this.getSmsMessageList()
            },
            changeRadio() {
                this.radioType == 1 && this.getCustomWxList()
            },
            delCustomWechat(id) {
                this.$confirm('确认撤销吗', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                })
                    .then(() => {
                        this.$http
                            .post(this.$store.state.baseUrl + "/user/cancelWxTask", qs.stringify({
                                taskId: id
                            }))
                            .then(response => {
                                if(response.data.code == '200') {
                                    this.$message.success('撤销成功')
                                    this.getCustomWxList()
                                }
                            })
                            .catch(error => {
                                console.log(error, "错误");
                            });
                    })
                    .catch(action => {
                        this.$message.info('已取消')
                    });
            },
            getSmsMessageList() {
                this.$http
                    .get(this.$store.state.baseUrl + "/user/queryWxTemplateMessagePage", {
                        params: {
                            current: this.tabRecord.page,
                            size: this.tabRecord.pageSize,
                            taskId: this.nowSmsId,
                            status: this.formRecord.state,
                            sendTimeBegin: this.formRecord.startTime ? getNowFormatDate(this.formRecord.startTime) : "",
                            sendTimeEnd: this.formRecord.endTime ? getNowFormatDate(this.formRecord.endTime) : ""
                        }
                    })
                    .then(response => {
                        this.smsRecordList = response.data.resultData.records;
                        this.smsRecordListTotal = response.data.resultData.total;
                    })
                    .catch(error => {
                        console.log(error, "错误");
                    });
            }
        }
    };
</script>
<style lang="less" scoped>
    .p-wx {
        .-wx-top {
            margin-bottom: 20px;
        }
        .-p-tab {
            font-size: 12px;
        }
        .-p-text-right {
            text-align: right;
        }
        .-p-time {
            display: inline-block;
            width: 190px;
            overflow: hidden;
        }
        .-p-span-text {
            display: inline-block;
            vertical-align: super;
        }
        .-p-modal-tab {
            margin-top: 10px;
            overflow-y: scroll;
            height: 400px;
        }
        .-p-modal-btn {
            vertical-align: bottom;
        }
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            background-color: #F5F5F5;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 4px rgba(234, 234, 234, .3);
            background-color: #555;
        }
        .-float-right {
            float: right;
        }

    }
</style>
