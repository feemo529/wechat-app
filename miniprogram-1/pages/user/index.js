// pages/user/index.js
Page({
    data: {
        userInfo: {},
        // 被收藏的商品的数量
        collectNums: 0
    },
    onShow() {
        const userInfo = wx.getStorageSync("userInfo");
        const collect = wx.getStorageSync('collect') || [];
        this.setData({ userInfo, collectNums: collect.length })
    },
    getUserProfile(e) {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                });
                wx.setStorageSync('userInfo', res.userInfo);
            }
        })
    }
})