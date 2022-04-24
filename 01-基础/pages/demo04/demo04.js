// pages/demo04/demo04.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0
  },
  // 输入框的input事件的执行逻辑
  handInput(e) {
    // console.log(e.detail.value);
    this.setData({
      num:parseInt(e.detail.value)
    })
  },
  // 加 减 按钮的事件
  plus(e){
    // console.log(e);
    // 1.获取自定义属性 operaion
    // const operation = e.currentTarget.dataset.operation;
    this.setData({
      num: this.data.num += 1 
    })

  },
  sub(e){
    this.setData({
      num: this.data.num -= 1 
    })
  }

})