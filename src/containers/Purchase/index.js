import React, { Component } from "react";
import Header from "../../components/Header";
import PurchaseForm from "./components/PurchaseForm";
import Tip from "../../components/Tip";
import { connect } from "react-redux";

import {
  actions as purchaseActions,
  getProduct,
  getTipStatus,
  getQuantity,
  getTotalPrice,
} from "../../redux/modules/purchase";
import { getUsername } from "../../redux/modules/login";
import { actions as detailActions } from "../../redux/modules/detail";
import { bindActionCreators } from "redux";

class Purchase extends Component {
  render() {
    const { product, showTip, quantity, phone, totalPrice } = this.props;
    return (
      <div>
        <Header title="下单" onBack={this.handleBack}></Header>
        {product ? (
          <PurchaseForm
            product={product}
            phone={phone}
            quantity={quantity}
            totalPrice={totalPrice}
            onSubmit={this.handleSubmit}
            onSetQuantity={this.handleSetQuantity}
          ></PurchaseForm>
        ) : null}

        {showTip ? (
          <Tip message="购买成功" onClose={this.handleCloseTip}></Tip>
        ) : null}
      </div>
    );
  }

  // 组件挂载时要加载产品的详情数据，避免redux中没有存储产品的数据
  componentDidMount() {
    const { product } = this.props;
    if (!product) {
      const { productID } = this.props.match.parmas.id;
      this.props.detailActions.loadProductDetail(productID);
    }
  }

  // 组件卸载时，使购买数量重置为1
  componentWillUnmount() {
    this.props.purchaseActions.setOrderQuantity(1);
  }

  handleBack = () => {
    this.props.history.goBack();
  };

  // 关闭购买成功对话框
  handleCloseTip = () => {
    this.props.purchaseActions.closeTip();
    this.props.history.goBack();
  };

  // 点击提交按钮，提交订单
  handleSubmit = () => {
    const productId = this.props.match.params.id;
    this.props.purchaseActions.submitOrder(productId);
  };

  // 设置订单购买数量
  handleSetQuantity = (quantity) => {
    this.props.purchaseActions.setOrderQuantity(quantity);
  };
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id;
  return {
    product: getProduct(state, productId),
    showTip: getTipStatus(state),
    quantity: getQuantity(state),
    phone: getUsername(state),
    totalPrice: getTotalPrice(state, productId),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    purchaseActions: bindActionCreators(purchaseActions, dispatch),
    detailActions: bindActionCreators(detailActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
