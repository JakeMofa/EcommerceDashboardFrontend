import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/src/components/loading";
import ASINTable from "@/src/components/table";
import Pagination from "@/src/components/pagination";
import ASINTooltip from "@/src/components/tooltip";
import { DefaultPerPage } from "@/src/config";
import { timeFormat, timeSince } from "@/src/helpers/formatting.helpers";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getUserList } from "@/src/services/users.services";
import { getBrandList } from "@/src/services/brands.services";
import AccountsModal from "@/src/components/permissions/AccountsModal";
import ModulesModal from "@/src/components/permissions/ModulesModal";
import { updateUserRequest, deleteUserRequest } from "@/src/api/users.api";
import { Input, Modal, Select, message } from "antd";
import _ from "lodash";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { selectUserList } from "@/src/store/slice/users.slice";
import { selectBrandList } from "@/src/store/slice/brands.slice";
import NoData from "@/src/components/no-data";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const userTypes = [
  { value: "", label: "All" },
  { value: "User", label: "User" },
  { value: "Manager", label: "Manager" },
  { value: "Admin", label: "Admin" },
  { value: "Amazon_admin", label: "Amazon Admin" },
  { value: "Walmart_admin", label: "Walmart Admin" },
];

const accountTypes = [
  { value: "", label: "All" },
  { label: "Internal", value: "internal" },
  { label: "External", value: "external" },
];

export default function Users() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [accountsModal, setAccountsModal] = useState(false);
  const [modulesModal, setModulesModal] = useState(false);
  const [clickedAccount, setClickedAccount] = useState({});

  const handleAccountsModal = () => {
    setAccountsModal(!accountsModal);
  };

  const handleModulesModal = () => {
    setModulesModal(!modulesModal);
  };

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState();
  const [accountType, setAccountType] = useState();
  const [pageSize, setPageSize] = useState(DefaultPerPage);

  const userList = useSelector(selectUserList);
  const brandList = useSelector(selectBrandList);

  useEffect(() => {
    if (userList) {
      setList(userList.items);
      setLoading(false);
      setTotalPage(userList.count);
    } else if (userList?.status === false) {
      // fakeActionUser()
    }
  }, [userList]);

  useEffect(() => {
    dispatch(getBrandList({ perPage: 9999 }));
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(getUserList({ page: page, perPage: pageSize }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPageNo = (e) => {
    setLoading(true);
    dispatch(
      getUserList({
        page: e,
        perPage: pageSize,
        search_term: searchText,
        role: role,
        account_type: accountType,
      })
    );
    setPage(e);
  };

  const onPerPage = (e) => {
    setPage(1);
    setPageSize(e);
    setLoading(true);
    dispatch(
      getUserList({
        page: 1,
        perPage: e,
        search_term: searchText,
        role: role,
        account_type: accountType,
      })
    );
  };

  const search = () => {
    setLoading(true);
    setPage(1);
    setList([]);
    dispatch(
      getUserList({
        page: page,
        perPage: pageSize,
        search_term: searchText,
        role: role,
        account_type: accountType,
      })
    );
  };

  useEffect(() => {
    search();
  }, [role, accountType]);

  const changeUserStatus = (id, status) => {
    updateUserRequest(id, { user_status: status })
      .then((res) => {
        if (res.status === 200) {
          const list_ = _.cloneDeep(list);
          const index = list_.findIndex((user) => user.id === res.data.id);
          list_[index] = res.data;
          setList(list_);
        }
      })
      .catch((err) => message.error(err));
  };

  const deleteUser = (userID) => {
    setLoading(true);
    deleteUserRequest(userID)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          dispatch(
            getUserList({
              page: page,
              perPage: pageSize,
              search_term: searchText,
            })
          );
          message.success("User has been Deleted Successfully");
        } else {
          setLoading(false);
          message.error("Unable to delete user");
        }
      })
      .catch((err) => message.error(err?.response?.message));
  };

  const columns = [
    {
      title: "#",
      width: 60,
      align: "left",
      render: (_, __, i) => {
        return <span>{(page - 1) * pageSize + 1 + i}</span>;
      },
    },
    {
      title: "Name",
      width: 120,
      align: "left",
      render: (text) => {
        return <b>{text?.u_name || "N/A"}</b>;
      },
    },
    {
      title: "Email",
      width: 200,
      align: "left",
      render: (text) => {
        return (
          <ASINTooltip rule title={text?.u_email}>
            {text?.u_email || "N/A"}
          </ASINTooltip>
        );
      },
    },
    {
      title: "Role",
      width: 110,
      align: "left",
      render: (text) => {
        return userTypes.find((t) => t.value == text.role)?.label || "N/A";
      },
    },
    {
      title: "Account Type",
      width: 110,
      align: "left",
      render: (text) => {
        return (
          accountTypes.find((t) => t.value == text.account_type)?.label || "N/A"
        );
      },
    },
    {
      title: "Brands",
      width: 90,
      align: "center",
      render: (text) => {
        return (
          <span
            className="cursor-pointer"
            onClick={() => {
              setClickedAccount({ id: text.id, name: text.u_name });
              handleAccountsModal();
            }}
          >
            View All
          </span>
        );
      },
    },
    {
      title: "Status",
      width: 120,
      align: "left",
      render: (text) => {
        return (
          <>
            {text.user_status === 0 ? (
              <button
                onClick={() => changeUserStatus(text.id, 1)}
                className="btn btn-sm btn-primary"
              >
                Activate
              </button>
            ) : (
              <button
                onClick={() => changeUserStatus(text.id, 0)}
                className="btn btn-sm btn-danger bg-danger"
              >
                Deactivate
              </button>
            )}
          </>
        );
      },
    },
    // {
    //   title: "Modules",
    //   width: 90,
    //   align: "center",
    //   render: (text) => {
    //     return (
    //       <span
    //         className="cursor-pointer"
    //         onClick={() => {
    //           handleModulesModal();
    //           setClickedAccount(text.u_email);
    //         }}
    //       >
    //         View All
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Created At",
      width: 150,
      align: "left",
      render: (text) => {
        return (
          <div>
            <span>{timeFormat(text.created_at)}</span>
            <br />
            <span className="timeStampColor">
              ({timeSince(text.created_at)})
            </span>
          </div>
        );
      },
    },
    {
      title: "Updated At",
      width: 150,
      align: "left",
      render: (text) => {
        return (
          <div>
            <span>{timeFormat(text.updated_at)}</span>
            <br />
            <span className="timeStampColor">
              ({timeSince(text.updated_at)})
            </span>
          </div>
        );
      },
    },
    {
      title: "Action",
      width: 70,
      align: "left",
      render: (text) => {
        const showDeleteConfirm = () => {
          confirm({
            title: `Are you sure to delete ${text.u_name} user?`,
            icon: <ExclamationCircleFilled />,
            content: "",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
              deleteUser(text.id);
            },
            onCancel() {},
          });
        };

        return (
          <div className="d-flex">
            <Link href={`/users/edit?userId=${text.id}&activeTab=general`}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{ marginRight: "10px" }}
                className="text-dark fs-3 cursor-pointer w-15px"
              />
            </Link>
            <FontAwesomeIcon
              onClick={showDeleteConfirm}
              icon={faTrashCan}
              className="text-danger fs-3 cursor-pointer w-15px"
            />
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          <div className="row mb-4">
            <div className="card card-flush h-xl-100">
              <div className="card-body px-4 py-4">
                <div className="d-flex flex-wrap gap-3">
                  <div>
                    <Input
                      size="large"
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyPress={(ev) => {
                        if (ev?.key === "Enter") {
                          ev?.preventDefault();
                          ev?.target?.blur();
                        }
                      }}
                      onBlur={() => {
                        search();
                      }}
                      value={searchText}
                      placeholder="search..."
                    />
                  </div>
                  <div>
                    <Select
                      size="large"
                      style={{ width: 150 }}
                      placeholder={`Select Role`}
                      value={role || null}
                      onChange={(e) => {
                        setRole(e);
                      }}
                      options={userTypes}
                    />
                  </div>
                  <div>
                    <Select
                      size="large"
                      style={{ width: 200 }}
                      placeholder={`Select Account Type`}
                      value={accountType || null}
                      onChange={(e) => {
                        setAccountType(e);
                      }}
                      options={accountTypes}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7">
                <div className="h-80px px-10 pt-4 d-flex flex-row justify-content-between align-items-center">
                  <h4 className="fw-bold">MANAGE USERS</h4>
                  <p
                    className="btn btn-dark"
                    onClick={() => router.push("/users/create")}
                  >
                    Add User
                  </p>
                </div>
                <div className="card-body pt-2">
                  {loading ? (
                    <Loading />
                  ) : list?.length != 0 ? (
                    <div>
                      <ASINTable
                        columns={columns}
                        dataSource={list}
                        ellipsis
                        rowKey="key"
                        loading={loading}
                        pagination={false}
                        scroll={{
                          x:
                            columns
                              ?.map((d) => d.width)
                              .reduce((a, b) => a + b, 0) + 300,
                        }}
                      />
                    </div>
                  ) : (
                    <NoData />
                  )}
                  <Pagination
                    loading={loading || list?.length === 0}
                    pageSize={pageSize}
                    page={page}
                    totalPage={totalPage}
                    onPerPage={onPerPage}
                    onPageNo={onPageNo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {accountsModal && (
        <AccountsModal
          isOpen={accountsModal}
          account={clickedAccount}
          closeModal={handleAccountsModal}
          brandList={brandList}
        />
      )}
      {/* <ModulesModal
        isOpen={modulesModal}
        account={clickedAccount}
        closeModal={handleModulesModal}
      /> */}
    </DashboardLayout>
  );
}
