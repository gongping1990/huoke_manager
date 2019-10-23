<template>
  <Modal
    class="p-word"
    v-model="isOpenModal"
    @on-cancel="closeModal('addInfo')"
    width="350"
    title="编辑生字">
    <Form :model="addInfo" ref="addInfo" :label-width="50" :rules="ruleValidate" class="-p-form">
      <FormItem label="词语" prop="word">
        <Input type="text" v-model="addInfo.word" placeholder="请输入生字"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="g-flex-j-sa">
      <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
      <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'wordModal',
    props: ['dataProp', 'type'],
    data() {
      return {
        isOpenModal: false,
        isSending: false,
        addInfo: {
          lessonId: this.$route.query.lessonId,
          word: ''
        },
        ruleValidate: {
          word: [
            {required: true, message: '请输入生字', trigger: 'blur'},
            {type: 'string', max: 3, message: '生字不能超过3个', trigger: 'blur'}
          ],
        }
      }
    },
    computed: {
      detailInfo() {
        return this.dataProp
      }
    },
    mounted (){
      this.isOpenModal = true
    },
    methods: {
      closeModal (name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
        this.$emit('closeWordModal')
      },
      submitInfo (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let params = this.type == '1' ? this.$api.hkywhdMission.addWord : this.$api.mission.addWord
            params(this.addInfo)
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('添加成功');
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-word {
  }
</style>
