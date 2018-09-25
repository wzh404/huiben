//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    categories: [],
    activeCategoryId: 0,
    goods:[],
    scrollTop:0,
    loadingMoreHidden:true,
    hasNoCoupons:true,
    coupons: [],
    searchInput: '',
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  onLoad: function () {
    var that = this
    /*
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    }) */
    wx.request({
      url: app.globalData.http + '/banner/list',
      data: {
        key: 'mallName'
      },
      success: function(res) {
        if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      },
      complete: function(res) {
        that.setData({
          banners: [
            {
              id: 1,
              url: 'https://yaopinzhinan.com/static/banner_1.jpg',
            },
            {
              id: 2,
              url: 'https://yaopinzhinan.com/static/banner_2.jpg',
            }
          ]
        })
      }
    }),
    wx.request({
      url: app.globalData.http + '/shop/goods/category/all',
      success: function(res) {
        var categories = [{ id: 0, name: "全部" }, { id: 1, name: "童话"}];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories:categories,
          activeCategoryId:0
        });
        that.getGoodsList(0);
      }
    })
    that.getCoupons ();
    that.getNotice ();
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
   },
  getGoodsList: function (categoryId) {   
    wx.showLoading({
      title: '加载中'
    })

    var that = this;
    wx.request({
      url: app.globalData.http + '/shop/goods/list',
      data: {
        categoryId: categoryId,
        nameLike: that.data.searchInput
      },
      success: function(res) {
        console.log(res)
        if (res.statusCode != 200) {
          return
        }
        /*
        that.setData({
          goods:[],
          loadingMoreHidden:true
        }); */
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }
        for(var i=0;i<res.data.data.length;i++){
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods:goods,
        });
      },
      complete: function (res) {
        var goods = [
          {
            id: 1,
            name: '绘本测试',
            pic: 'https://yaopinzhinan.com/static/timg_1.jpg',
            minPrice: 100,
            originalPrice: 120
          },
          {
            id: 2,
            name: '绘本测试2',
            pic: 'https://yaopinzhinan.com/static/timg_2.jpg',
            minPrice: 100,
            originalPrice: 120
          },
          {
            id: 3,
            name: '绘本测试3',
            pic: 'https://yaopinzhinan.com/static/timg_2.jpg',
            minPrice: 100,
            originalPrice: 120
          }
        ];

        var list = that.data.goods
        for (var i = 0; i < goods.length; i++) {
          list.push(goods[i]);
        }
        that.setData({
          goods: list,
          loadingMoreHidden: true
        });
        wx.hideLoading()
      }
    })
  },
  getCoupons: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          });
        }
      },
      complete: function (res) {
        that.setData({
          hasNoCoupons: false,
          coupons: [
            {
              moneyMax: 50,
              name: '新店优惠',
              moneyHreshold: 300,
              dateEndType: 0,
              dateEnd: '2018-10-10'
            },
            {
              moneyMax: 20,
              name: '新店优惠',
              moneyHreshold: 200,
              dateEndType: 0,
              dateEnd: '2018-10-10'
            }
          ]
        });
      }
    })
  },
  gitCoupon : function (e) {
    var that = this;
    wx.request({
      url: app.globalData.http + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + '/notice/list',
      data: { pageSize :5},
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          });
        }
      }, 
      complete: function (res) {
        that.setData({
          noticeList: {
            dataList: [
              {
                id: 1,
                title: '最新绘本到货了，优惠多多'
              },
              {
                id: 2,
                title: '商城新开张，优惠多多，戳我看详细。'
              }
            ]
          }
        });
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch : function (){
    // this.getGoodsList(this.data.activeCategoryId);
    console.log('search')
    
    wx.navigateTo({
      url: "/pages/search/index"
    })
  },
  onReachBottom: function () {    
    this.getGoodsList(0)
  }
})
