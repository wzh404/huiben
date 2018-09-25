//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    
  },
  onLoad: function () {
    var that = this
    var temData = {};
    wx.getSystemInfo({
      success: function (res) {
        
        temData.hotKeys = ["American", "Show time", "王岐同学的书包", "哈哈哈"]
        temData.his = ["aaa", "bbb", "王岐同学的书包", "哈哈哈"]
        that.setData({
          wxSearchData: temData
        });
      }
    });
  } 
})
