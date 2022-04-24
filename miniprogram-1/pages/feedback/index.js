/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
    data: {
        tabs: [{
                id: 0,
                value: "体验问题",
                isActive: true
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false
            }
        ],
        // 被选中的图片路径 数组
        chooseImage: [],
        // 文本域得内容
        textVal: ""
    },
    // 外网得图片得路径数组
    UpLoadImgs: [],
    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e) {
        // console.log(e);
        // 1.获取被点击的标题索引
        const { index } = e.detail;
        // 2.修改数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 3.赋值到data中
        this.setData({
            tabs
        })
    },
    // 点击+选择图片
    handleChooseImg() {
        // 调用小程序内置的选择图片的api
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                // console.log(result);
                this.setData({
                    // 图片数组 进行拼接
                    chooseImage: [...this.data.chooseImage, ...result.tempFilePaths]
                })
            }
        });
    },
    // 点击 自定义图片组件
    handleRemoveImg(e) {
        const { index } = e.currentTarget.dataset;
        let { chooseImage } = this.data;
        chooseImage.splice(index, 1);
        this.setData({
            chooseImage
        })
    },
    // 文本域得输入得事件
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },
    // 提交按钮得点击
    handleFormSubmit() {
        const { textVal, chooseImage } = this.data;
        if (!textVal.trim()) {
            wx.showToast({
                title: '输入不合法',
                icon: "none",
                mask: true
            });
            return;
        }
        // wx.showLoading({
        //     title: "正在上传中",
        //     mask: true,
        // });

        if (chooseImage.length != 0) {
            // 准备上传图片 到专门得图片服务器
            chooseImage.forEach((v, i) => {
                try {
                    wx.uploadFile({
                        url: 'https://images.ac.cn/Home/Index/UploadAction/',
                        filePath: v,
                        name: 'file',
                        success: (result) => {
                            console.log(result);
                            let url = JSON.parse(result.data).url;
                            this.UpLoadImgs.push(url);

                            // 所有图片都上传完毕了才触发
                            if (i === chooseImage.length - 1) {
                                console.log("提交到外网");
                                this.setData({
                                    textVal: "",
                                    chooseImage: []
                                });
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }
                    });
                } catch (error) {
                    wx.showToast({
                        title: '上传失败',
                        icon: 'none',
                        image: '',
                        mask: false,
                    });
                }

            });
        } else {
            console.log("只是提交文本");
        }

    }
})