import React, { Component } from "react";
import "./style.css";
import Slider from "react-slick";
// 组件中使用到的头条文章信息
// 数组中的每一项就是Headline中的每一项
const dataSource = [
  {
    pic: "https://p1.meituan.net/gpa/5ee6d6d00d942804557c73abff79b855116489.jpg%40100w_100h_1e_1c_1l%7Cwatermark%3D1%26%26r%3D1%26p%3D9%26x%3D20%26y%3D20",
    title: "精选专题：2021好物盘点",
    url: "https://h5.dianping.com/app/h5-ranklist-static/list_nearby.html?collectionId=227&source=weixinM",
  },
  {
    pic: "https://p0.meituan.net/gpa/387438cef7e2bb9eff5b701dde173f27268549.png%40100w_100h_1e_1c_1l%7Cwatermark%3D1%26%26r%3D1%26p%3D9%26x%3D20%26y%3D20",
    title: "不比出国差，短假期选这些地方玩！当天都来得及去哦～",
    url: "https://h5.dianping.com/app/h5-ranklist-static/list_nearby.html?headlineId=394055&source=weixinM",
  },
  {
    pic: "https://p1.meituan.net/gpa/fbd325713d43366810452c38fc0e32e1945185.png%40100w_100h_1e_1c_1l%7Cwatermark%3D1%26%26r%3D1%26p%3D9%26x%3D20%26y%3D20",
    title: "吓到腿软！12条玻璃栈道，敢去吗？",
    url: "https://h5.dianping.com/app/h5-ranklist-static/list_nearby.html?headlineId=484549&source=weixinM",
  },
];

class Headline extends Component {
  render() {
    const settings = {
      sliderToshow: 1,
      swipeToSlide: true,
      autoplay: true,
      // 自上而下的滚动效果
      vertical: true,
    };
    return (
      <div className="headline">
        <div className="headline__logo"></div>
        <div className="headline__slider">
          <Slider {...settings}>
            {dataSource.map((item, index) => {
              return (
                <a
                  key={index}
                  className="headline__sliderInner"
                  href={item.url}
                >
                  <div className="headline__sliderTitle">{item.title}</div>
                  <div className="headline__sliderImgWrapper">
                    <img
                      src={item.pic}
                      alt=""
                      className="headline__sliderImg"
                    ></img>
                  </div>
                </a>
              );
            })}
          </Slider>
        </div>
      </div>
    );
  }
}

export default Headline;
