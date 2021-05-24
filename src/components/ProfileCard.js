import React, { useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, Spin, Row, Col } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { logoutFromFirebase, updateUserInfo, requestOrderDetail, requestOrderID, createOrder } from "../actions";
import { StoreContext } from "../store";

const ProfileCard = ({orderId}) => {
  const {
    state: {
      cart,
      orderInfo: { success },
      userSignin: { userInfo }, searchOrderDetailByUid: {
        loading,
        order,
        error,
        tapOrNot
      },
    },
    dispatch,
  } = useContext(StoreContext);
  const { displayName, email } = userInfo;
  const history = useHistory();
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80, color: "#8183ff" }} spin />;

  const handleUpdate = (values) => {
    console.log(values)
    updateUserInfo(dispatch, values);
  };

  const handleLogout = () => {
    logoutFromFirebase(dispatch);
    history.push("/");
  };

  const handleOrderSearch = () => {
    console.log(order);
    requestOrderID(dispatch);
  };
  

  return (
    <div>
      <Form
      onFinish={handleUpdate}
      name="normal_login"
      className="login-form"
      form={form}
      initialValues={userInfo}
    >
      <Form.Item
        label="name: "
        name="name"
        rules={[
          {
            type: "string",
            message: "The input is not valid name!",
          },
          {
            message: "Please input your name!",
          },
        ]}
        hasFeedback
      >
        <Input placeholder={displayName} />
      </Form.Item>
      <Form.Item
        label="email: "
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            message: "Please input your E-mail!",
          },
        ]}
        hasFeedback
      >
        <Input placeholder={email} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="rePassword"
        label="Re-enter Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            message: "Please re-enter your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button
          type="info"
          htmlType="submit"
          className="login-form__button"
          onClick={handleOrderSearch}
        >
          SearchOrder
        </Button>

        <Button
          type="primary"
          style={{ marginTop: "0.8rem" }}
          htmlType="submit"
          className="login-form__button"
        >
          Submit
        </Button>

        <Button
          type="danger"
          style={{ marginTop: "0.8rem" }}
          className="login-form__button"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Form.Item>
    </Form>
    <div className="profileorderlist">
        { tapOrNot?(loading?(
          <div className="spinner-wrap">
            <Spin indicator={antIcon} className="spinner" />
          </div>
        ):(
          order.length===0?(<div className="eachOrder_title">
            <p>None</p></div>):(
              order.map(order=>{return(
                <Link to={`/order/${order.id}`}>
                  <Button
                  style={{ margin: "0.8rem" }}
                >
                  訂單編號: {order.id}</Button>
                </Link>
              )
                

              })
            )
        )):(<div></div>)}
    </div>
    </div>
    
  );
};
export default ProfileCard;
