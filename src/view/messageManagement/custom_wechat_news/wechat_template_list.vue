<!-->
微信自定义模板消息推送页面
<-->
<template>
    <div class="p-wx">
        <el-table :data="wxTemplateList" style="width: 100%" class="-p-tab">
            <el-table-column type="index" label="模板ID" width="80"></el-table-column>
            <el-table-column prop="gmtCreate" label="模板参数">
                <template slot-scope="scope">
                    <pre>{{scope.row.param}}</pre>
                </template>
            </el-table-column>

            <el-table-column prop="content" label="内容示例">
                <template slot-scope="scope">
                    <pre>{{scope.row.content}}</pre>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="addOpenModal(scope.row.id)">添加任务</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="tab.page"
            :page-size="tab.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="wxTemplateListTotal" background>
        </el-pagination>

        <user-selection ref="childMethod" v-if="isAddOpenModal"
                        @close="closeModal"
                        @submitModal="submitMessage"
                        :title="title"
                        :templateId='wxTemplateId'
                        :type="2"></user-selection>
    </div>
</template>

<script>
    import {getNowFormatDate} from "@/utils/date";
    import qs from "qs";
    import UserSelection from "@/components/userSelection";

    export default {
        components: {UserSelection},
        data() {
            return {
                tab: {
                    page: 1,
                    pageSize: 10
                },
                form: {
                    startTime: "",
                    endTime: "",
                    state: "3"
                },
                addInfo: {
                    condition: "",
                    userIds: [],
                    sendTime: "",
                    sendType: "",
                    first: "",
                    remark: ""
                },
                wxTemplateList: [],
                wxTemplateListTotal: 0,
                isAddOpenModal: false,
                keywordStorage: "",
                wxTemplateId: "",
                title: '添加自定义微信'
            };
        },
        mounted() {
            this.getWxList();
        },
        methods: {
            sizeChange(val) {
                this.tab.page = 1;
                this.tab.pageSize = val;
                this.getWxList();
            },
            currentChange(val) {
                this.tab.page = val;
                this.getWxList();
            },
            //分页查询
            getWxList() {
                this.$http
                    .get(this.$store.state.baseUrl + "/user/listCustomTemplate", {
                        params: {
                            current: this.tab.page,
                            size: this.tab.pageSize
                        }
                    })
                    .then(response => {
                        this.wxTemplateList = response.data.resultData.records;
                        this.wxTemplateListTotal = response.data.resultData.total;
                    })
                    .catch(error => {
                        console.log(error, "错误");
                    });
            },

            addOpenModal(wxId) {
                this.addInfo = {
                    condition: "",
                    userIds: [],
                    sendTime: "",
                    sendType: "",
                    first: "",
                    remark: ""
                };
                this.wxTemplateId = wxId;

                this.keywords = [];

                this.isAddOpenModal = true

                setTimeout(() => {
                    this.$refs.childMethod.init()
                }, 0)
            },
            closeModal() {
                this.isAddOpenModal = false;
            },
            submitMessage(param) {

                this.addInfo = Object.assign(this.addInfo, param)

                if (!this.addInfo.userIds.length && (this.addInfo.condition == '')) {
                    return this.$message.error("请选择用户");
                } else if (this.addInfo.sendType == "") {
                    return this.$message.error("请选择发送类别");
                } else if (this.addInfo.first == "") {
                    return this.$message.error("请输入first");
                } else if (this.addInfo.first.length > 100) {
                    return this.$message.error("first长度不能超过100字");
                } else if (this.addInfo.remark == "") {
                    return this.$message.error("请输入remark");
                } else if (this.addInfo.remark.length > 100) {
                    return this.$message.error("remark长度不能超过100字");
                } else if (this.addInfo.sendType == "2" && this.addInfo.sendTime == "") {
                    return this.$message.error("请输入定时发送时间");
                }

                // delete this.addInfo.radioType
                this.$http
                    .post(
                        this.$store.state.baseUrl + "/user/sendWxTask", {
                            id: this.wxTemplateId,
                            ...this.addInfo
                        }
                    ).then(response => {
                    if (response.data.code == "200") {
                        this.$message.success("发送成功");
                        this.addInfo = {
                            condition: "",
                            userIds: [],
                            sendTime: "",
                            sendType: "",
                            first: "",
                            remark: ""
                        };
                        this.isAddOpenModal = false;
                        this.getWxList();
                    }
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
        .-p-tab {
            font-size: 12px;
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
            overflow-y: scroll;
            height: 400px;
        }
        .-p-modal-btn {
            vertical-align: bottom;
        }
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            background-color: #f5f5f5;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 4px rgba(234, 234, 234, 0.3);
            background-color: #555;
        }
        .-card-left {
            margin-right: 10px;

            .-left-user {
                display: flex;

                .-user-left {
                    flex: 1;
                    border: 1px solid #ebeef5;
                    border-radius: 3px;
                    padding: 10px;
                    margin: 10px;

                    .-c-l-wrap {
                        height: 372px;
                        overflow-y: scroll;
                    }
                }

                .-user-right {
                    flex: 1;
                    border: 1px solid #ebeef5;
                    border-radius: 3px;
                    padding: 10px;
                    margin: 10px;
                    min-width: 184px;

                    .-u-right-content {
                        height: 372px;
                        overflow-y: scroll;
                    }

                    .-user-r-wrap {
                        padding: 12px;
                        border: 1px solid #dcdfe6;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        margin-right: 10px;
                    }

                    .-u-right-text {
                        height: 47px;
                        line-height: 47px;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                }
            }

            .-c-l-check {
                margin: 10px 0;
            }

            .-c-l-list {
                display: inline-block;
                margin-bottom: 10px;
                margin-left: 0 !important;
                margin-right: 10px;
                height: 56px;
            }

            .-list {
                display: flex;
            }

            .-list-img {
                width: 26px;
                height: 26px;
                position: relative;
                margin-right: 10px;
                top: 7px;

                img {
                    width: 100%;
                }
            }
            .-list-text {
                font-size: 12px;
                width: 100px;
            }
        }
        .-c-btn {
            text-align: center;
        }
        .-card-right-top {
            margin-bottom: 10px;

            .-card-right-input {
                width: 80%;
                float: right;
            }
        }
        .-card-time {
            margin-top: 10px;
        }

        .-search-icon {
            padding: 7px 8px;
        }

        .-search-content {
            margin-top: 10px;
            height: 372px;
            overflow-y: scroll;
        }
    }
</style>
