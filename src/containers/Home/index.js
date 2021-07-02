import React, { Component } from "react";
import "./style.css";
import Category from "./components/Category";
import Headline from "./components/Headline";
import Discount from "./components/Discount";
import LikeList from "./components/LikeList";
import HomeHeader from "./components/HomeHeader";
import Banner from "../../components/Banner";
import Activity from "./components/Activity";
import Footer from "../../components/Footer";
import { connect } from "react-redux";
import {
  actions as homeActions,
  getLikes,
  getDiscounts,
  getPageCountOfLikes,
} from "../../redux/modules/home";
import { bindActionCreators } from "redux";

class Home extends Component {
  render() {
    const { likes, discounts, pageCount } = this.props;
    return (
      <div>
        <HomeHeader></HomeHeader>
        <Banner></Banner>
        <Category></Category>
        <Headline></Headline>
        <Activity></Activity>
        <Discount data={discounts}></Discount>
        <LikeList
          data={likes}
          pageCount={pageCount}
          fetchData={this.fetchMoreLikes}
        ></LikeList>
        <Footer></Footer>
      </div>
    );
  }

  fetchMoreLikes = () => {
    this.props.homeActions.loadLikes();
  };

  componentDidMount() {
    this.props.homeActions.loadDiscounts();
  }
}

const mapStateToProps = (state, props) => {
  return {
    likes: getLikes(state),
    discounts: getDiscounts(state),
    pageCount: getPageCountOfLikes(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    homeActions: bindActionCreators(homeActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
