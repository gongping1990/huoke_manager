<template>
    <div class="wangEditor" ref="wangEditor"></div>
</template>

<script>
let E = require("wangeditor");
export default {
  props: {
    type: {
      type: String,
      default: "html"
    },
    value: {
      type: String,
      default: ""
    },
    pasteFilterStyle: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 10000
    },
    uploadImgServer: {
      type: String
    },
    uploadImgHeaders: {
      type: Object
    },
    uploadFileName: {
      type: String,
      default: "file"
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    uploadImgHooks: {
      type: Object,
      default: () => ({
        customInsert: (insertImg, result, editor) => {
          console.log(result);
          if (result.code == 200) {
            insertImg(result.resultData.url);
          } else {
            this.$message.error(result.msg);
          }
        },
        fail: (xhr, editor, result) => {
          console.log(xhr, result);
        },
        error: (xhr, editor) => {
          console.log(xhr);
          console.log(editor);
        }
      })
    },
    debug: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array,
      default: () => [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        // "list", // 列表
        "justify", // 对齐方式
        // "quote", // 引用
        // "emoticon", // 表情
        "image", // 插入图片
        // "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ]
    },
    colors: {
      type: Array,
      default: () => [
        "#000000",
        "#eeece0",
        "#1c487f",
        "#4d80bf",
        "#c24f4a",
        "#8baa4a",
        "#7b5ba1",
        "#46acc8",
        "#f9963b",
        "#ffffff"
      ]
    },
    fontNames: {
      type: Array,
      default: () => ["宋体", "微软雅黑", "Arial", "Tahoma", "Verdana"]
    },
    onfocus: {
      type: Function
    },
    onblur: {
      type: Function
    }
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    value(n, o) {
      console.log(1111)
      this.setHtml(n);
    }
  },
  methods: {
    // 初始化富文本
    created() {
      this.editor.create();
    },
    // 设置是否禁用富文本
    contenteditable(bol) {
      this.editor.$textElem.attr("contenteditable", bol);
    },
    // 设置富文本内容
    setHtml(str) {
      this.editor.txt.html(str);
    },
    // 获取富文本中的内容
    getContent() {
      return {
        html: this.editor.txt.html(),
        text: this.editor.txt.text()
      };
    },
    // 往富文本中追加内容
    appendHtml(str) {
      this.editor.txt.append(str);
    },
    // 清除富文本内容
    clearHtml() {
      this.editor.txt.clear();
    },
    createEditor() {
      let editor = this.editor;
      // 配置富文本菜单栏
      editor.customConfig.menus = this.menus;
      // 配置富文本编辑区zIndex
      editor.customConfig.zIndex = 100;
      // 配置菜单栏颜色选择列表
      editor.customConfig.colors = this.colors;
      // 配置菜单栏字体列表
      editor.customConfig.fontNames = this.fontNames;
      // 配置自定义上传链接
      if (this.uploadImgServer) {
        editor.customConfig.uploadImgServer = this.uploadImgServer;
      }
      // 上传图片时，可自定义filename，即在使用formdata.append(name, file)添加图片文件时，自定义第一个参数。
      editor.customConfig.uploadFileName = this.uploadFileName;
      // 跨域上传中如果需要传递 cookie 需设置 withCredentials
      editor.customConfig.withCredentials = this.withCredentials;
      // 上传图片时刻自定义设置 header
      if (this.uploadImgHeaders) {
        editor.customConfig.uploadImgHeaders = this.uploadImgHeaders;
      }

      // 可使用监听函数在上传图片的不同阶段做相应处理
      editor.customConfig.uploadImgHooks = this.uploadImgHooks;
      // 配置是否开启debug模式
      if (this.debug) {
        editor.customConfig.debug = this.debug;
      }
      // 配置粘贴内容时是否过滤内容
      editor.customConfig.pasteFilterStyle = this.pasteFilterStyle;
      // 点击富文本触发onfocus事件时的方法
      if (this.onfocus) {
        editor.customConfig.onfocus = this.onfocus;
      }
      // 富文本失去焦点是触发方法
      if (this.onblur) {
        editor.customConfig.onfocus = this.onblur;
      }

      // 富文本点击或者输入时 触发 onchange时 向上分发自定义事件input ，  在组件中可以使用v-model进行绑定
      editor.customConfig.onchange = () => {
        switch (this.type) {
          case "html":
            this.$emit("input", this.editor.txt.html());
            console.log(this.getContent());
            break;
          case "text":
            this.$emit("input", this.editor.txt.text());
            console.log(this.getContent());
            break;

          default:
            this.$emit("input", this.editor.txt.html());
            break;
        }
      };
      this.created();
      if (this.value) {
        this.setHtml(this.value);
      }

    }
  },
  created() {},
  mounted() {
    this.editor = new E(this.$refs.wangEditor);
    this.createEditor();
  }
};
</script>

<style>
</style>
