import React, { Component } from "react";
import ProductOverview from "./components/ProductOverview";
import ShopInfo from "./components/ShopInfo";
import Detail from "./components/Detail";
import Remark from "./components/Remark";
import BuyButton from "./components/BuyButton";
import Header from "../../components/Header";

import {
  actions as detailActions,
  getProduct,
  getRelatedShop,
} from "../../redux/modules/detail";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class ProductDetail extends Component {
  render() {
    const { product, relatedShop } = this.props;
    console.log("product", product);
    return (
      <div>
        <Header title="团购详情" onBack={this.handleBack} grey={true}></Header>
        {product && <ProductOverview data={product}></ProductOverview>}
        {relatedShop && (
          <ShopInfo
            data={relatedShop}
            total={product.shopIds.length}
          ></ShopInfo>
        )}
        {product && <Detail data={product}></Detail>}
        {product && <Remark data={product}></Remark>}
        {product && <BuyButton productId={product.id}></BuyButton>}
      </div>
    );
  }

  componentDidMount() {
    const { product } = this.props;
    if (!product) {
      const productId = this.props.match.params.id;
      this.props.detailActions.loadProductDetail(productId);
    } else if (!this.props.relatedShop) {
      this.props.detailActions.loadShopById(product.nearestShop);
    }
  }

  componentDidUpdate(preProps) {
    // 上一次的props中product信息不存在，这次存在
    // 表明刚刚获取了商品的详情信息(第一次获取到商品的详情信息)
    if (!preProps.product && this.props.product) {
      this.props.detailActions.loadShopById(this.props.product.nearestShop);
    }
  }

  handleBack = () => {
    this.props.history.goBack();
  };
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id;
  return {
    product: getProduct(state, productId),
    relatedShop: getRelatedShop(state, productId),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    detailActions: bindActionCreators(detailActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
