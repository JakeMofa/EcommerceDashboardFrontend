import { EditCategoryProductData } from "@/src/api/categoryList.api";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { setUpdateCategoryProduct } from "@/src/store/slice/categoryProductList.slice";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Select,
  Space,
  InputNumber,
  message,
} from "antd";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

const EditCategoryProductDataModal = ({
  initialValues = {
    category_id: null,
    product_title: "",
    product_status: "",
  },
  onSubmit = () => {},
  id = null,
}) => {
  const dispatch = useDispatch();
  const CategoryListRes = useSelector(selectCategoryList);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [submit, setSubmit] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesEnabled, setSubCategoriesEnabled] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    if (brand.subcategories_enabled) {
      setSubCategoriesEnabled(true);
      setCategoriesList(
        CategoryListRes.data?.map((item) => ({
          label: item.name,
          options: item.subcategories.map((c) => ({
            label: c.name,
            value: c.id,
          })),
        }))
      );
    } else {
      setCategoriesList(
        CategoryListRes.data?.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
  }, [CategoryListRes]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    if (name) {
      e.preventDefault();
      form.setFieldValue("category_id", name);
      setName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const onFinish = (values) => {
    setSubmit(true);
    messageApi.open({
      type: "loading",
      content: "in progress...",
      duration: 0,
    });

    const newCategoryParams =
      typeof values.category_id === "string"
        ? { category_id: null, category: values.category_id }
        : {};
    EditCategoryProductData(id, {
      ...values,
      ...newCategoryParams,
      product_status: values.product_status ? "Active" : "inactive",
    })
      .then((res) => {
        const cat = {};
        if (subCategoriesEnabled) {
          const parentCategory = CategoryListRes?.data?.find((r) =>
            r.subcategories.some((s) => s.id === res.data.category_id)
          );

          cat.parent_category = parentCategory.name;
          cat.category = parentCategory.subcategories.find(
            (r) => r.id === res.data.category_id
          )?.name;
        } else {
          cat.category =
            newCategoryParams.category ||
            CategoryListRes?.data?.find((r) => r.id === res.data.category_id)
              ?.name;
        }
        dispatch(setUpdateCategoryProduct({ ...res.data, ...cat }));
        message.destroy();
        message.success(`Successfully Edited`);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        setSubmit(false);
        onSubmit();
      });
  };

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        name="import"
        onFinish={onFinish}
        initialValues={{
          name: "",
          ...initialValues,
          product_status: initialValues.product_status === "Active",
        }}
      >
        <Form.Item
          name="category_id"
          label="Category"
          placeholder="Edit Category"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Edit Category"
            dropdownRender={(menu) => (
              <>
                {menu}
                {!subCategoriesEnabled && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <Input
                        placeholder="Add New Category"
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                      />
                      <Button
                        disabled={name === ""}
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addItem}
                      >
                        Add Category
                      </Button>
                    </Space>
                  </>
                )}
              </>
            )}
            options={categoriesList}
          />
        </Form.Item>
        <Form.Item
          name="product_title"
          label="Product Title"
          placeholder="Edit product title"
          rules={[{ required: true, type: "string" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="case_pack_size"
          label="Case Pack Size"
          placeholder="Edit Case Pack Size"
        >
          <InputNumber />
        </Form.Item>
        <Form.Item name="product_status" valuePropName="checked">
          <Checkbox>{"Active"}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={submit} htmlType="submit">
            Edit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default EditCategoryProductDataModal;
