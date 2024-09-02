import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TvSvg } from "@/src/assets";
import { getAmazonAdvertisingCredentialsList } from "@/src/services/brands.services";
import { selectAmazonAdvertisingCredentialsList } from "@/src/store/slice/brands.slice";
import { deleteAmazonAdvertisingCredentialsRequest } from "@/src/api/brands.api";
import { selectFilter } from "@/src/helpers/selectFilter";

import Loading from "@/src/components/loading";

import { Modal, message, Form, Select } from "antd";
import ASINTable from "@/src/components/table";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { regionOptions, marketplaceOptions } from "@/src/constants/marketplace";

const clientID = process.env.NEXT_PUBLIC_ADVERTISING_CLIENT_ID;
const { confirm } = Modal;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 16,
    },
  },
};

export default function AdvertisingCredentials({ brand }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [uspRegion, setUspRegion] = useState(null);
  const [marketPlace, setMarketPlace] = useState(null);

  console.log(marketPlace);

  const amazonSpApiCredentialsList = useSelector(
    selectAmazonAdvertisingCredentialsList
  );

  useEffect(() => {
    dispatch(getAmazonAdvertisingCredentialsList(brand.id));
  }, []);

  useEffect(() => {
    if (amazonSpApiCredentialsList.status) {
      setList(
        amazonSpApiCredentialsList.data.map((d) => {
          return {
            id: d.id,
            ...JSON.parse(d.credential_details),
          };
        })
      );
      setLoading(false);
    }
  }, [amazonSpApiCredentialsList]);

  useEffect(() => {
    window.onAmazonLoginReady = function () {
      amazon.Login.setClientId(clientID);
    };

    (function (d) {
      var a = d.createElement("script");
      a.type = "text/javascript";
      a.async = true;
      a.id = "amazon-login-sdk";
      a.src = "https://assets.loginwithamazon.com/sdk/na/login1.js";
      d.getElementById("amazon-root").appendChild(a);
    })(document);

    document.getElementById("LoginWithAmazon").onclick = function () {
      if (marketPlace) {
        var options = {};
        const user = JSON.parse(localStorage.getItem("user"));
        options.scope = "advertising::campaign_management";
        options.response_type = "code";
        amazon.Login.authorize(
          options,
          `${window.location.origin}/api/callbacks/advertising-auth?state=${brand.id}!!${user.id}!!${marketPlace}`
        );
        return false;
      } else {
        message.error("Please select region and market place");
      }
    };
  }, [marketPlace]);

  const deleteAmazonSpApiCredentials = (id) => {
    deleteAmazonAdvertisingCredentialsRequest(brand.id, id)
      .then((res) => {
        if (res.status === 200) {
          dispatch(getAmazonAdvertisingCredentialsList(brand.id));
          message.success(
            "Amazon Advertising Credentials has been deleted successfully"
          );
        } else {
          message.error("Unable to delete Amazon Advertising Credentials");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const columns = [
    {
      title: "Action",
      width: 70,
      align: "left",
      render: (text) => {
        const showDeleteConfirm = () => {
          confirm({
            title: `Are you sure to delete ${text.country_code} Advertising Credentials?`,
            icon: <ExclamationCircleFilled />,
            content: "",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
              deleteAmazonSpApiCredentials(text.id);
            },
            onCancel() {},
          });
        };
        return (
          <div className="d-flex">
            <FontAwesomeIcon
              onClick={showDeleteConfirm}
              icon={faTrashCan}
              className="text-danger fs-3 w-15px cursor-pointer"
            />
          </div>
        );
      },
    },
    {
      title: "#",
      align: "left",
      key: "id",
      render: (_, __, i) => {
        return <span>{1 + i}</span>;
      },
    },
    {
      title: "Seller Account Name",
      key: "seller_id",
      align: "left",
      render: (text) => {
        return <b>{text?.seller_id || "N/A"}</b>;
      },
    },
    {
      title: "Profile ID",
      key: "profile_id",
      align: "left",
      render: (text) => {
        return <b>{text?.profile_id || "N/A"}</b>;
      },
    },
    {
      title: "Client ID",
      key: "client_id",
      align: "left",
      render: (text) => {
        return <b>{text?.client_id || "N/A"}</b>;
      },
    },
    {
      title: "Country Code",
      key: "country_code",
      align: "left",
      render: (text) => {
        return <b>{text?.country_code || "N/A"}</b>;
      },
    },
    {
      title: "Currency Code",
      key: "currency_code",
      align: "left",
      render: (text) => {
        return <b>{text?.currency_code || "N/A"}</b>;
      },
    },
    {
      title: "Time Zone",
      key: "time_zone",
      align: "left",
      render: (text) => {
        return <b>{text?.time_zone || "N/A"}</b>;
      },
    },
    {
      title: "Refresh Token",
      key: "refresh_token",
      align: "left",
      render: (text) => {
        return <b>{text?.refresh_token || "N/A"}</b>;
      },
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-7">
            <div className="card-body">
              <div className="row">
                <div id="amazon-root"></div>

                <div className="col-12 d-flex flex-row mb-5">
                  <TvSvg />
                  <h4 className="mx-5 mt-1">Amazon Advertising Credentials</h4>
                </div>
              </div>
              <Form
                {...formItemLayout}
                layout="vertical"
                form={form}
                name="brandAdvertisingCredentials"
              >
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="usp_region"
                      label="Region"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Region cannot be blank",
                        },
                      ]}
                      hasFeedback
                    >
                      <Select
                        style={{
                          width: "100%",
                        }}
                        name="usp_region"
                        value={uspRegion}
                        onChange={setUspRegion}
                        size="large"
                        placeholder="Select Region"
                        options={regionOptions}
                        filterOption={selectFilter}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-6">
                    <Form.Item
                      name="marketplace"
                      label="Marketplace"
                      className="fw-bolder"
                      rules={[
                        {
                          required: true,
                          message: "Marketplace cannot be blank",
                        },
                      ]}
                      hasFeedback
                      help={
                        !uspRegion && (
                          <div style={{ marginBottom: 12 }}>
                            Select your <b>Region</b> first
                          </div>
                        )
                      }
                    >
                      <Select
                        disabled={!uspRegion}
                        style={{
                          width: "100%",
                        }}
                        size="large"
                        placeholder="Select Marketplace"
                        options={marketplaceOptions(uspRegion)}
                        onChange={setMarketPlace}
                        filterOption={selectFilter}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>

              <div className="row">
                <div id="amazon-root"></div>
                <div className="col-12 d-flex flex-row mb-5">
                  <img
                    border="0"
                    alt="Login with Amazon"
                    src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
                    width="156"
                    height="32"
                    className="cursor-pointer"
                    id="LoginWithAmazon"
                  />
                </div>
              </div>
              <div className="row mt-4 pt-4 border-top">
                <h4 className="mx-5 mt-6">
                  Amazon Advertising Credentials List
                </h4>
              </div>
              <div className="mt-2">
                {loading ? (
                  <Loading />
                ) : (
                  <ASINTable
                    columns={columns}
                    dataSource={list}
                    rowKey="key"
                    pagination={false}
                    scroll={{
                      x:
                        columns
                          ?.map((d) => d.width)
                          .reduce((a, b) => a + b, 0) + 300,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
