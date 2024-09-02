import Link from "next/link";
import {
  ClipboardSvg,
  GraphSvg,
  LockSvg,
  PaperSvg,
  SettingsSvg,
  UserLgSvg,
  UsersSvg,
  StackSvg,
} from "../assets";

function getItem(
  label,
  key,
  icon,
  children,
  parent = null,
  enableLink = false
) {
  return {
    key,
    icon,
    children,
    label:
      parent || enableLink ? (
        <Link href={`${parent ? `/${parent}` : ""}/${key}`}>{label}</Link>
      ) : (
        label
      ),
  };
}

export const adminMenus = [
  getItem("Manage Brands", "brands", <UsersSvg />, null, null, true),
  getItem("Manage Users", "users", <LockSvg />, null, null, true),
  ...(process.env.NEXT_PUBLIC_PRODUCTION === "true"
    ? []
    : [getItem("Manage Data", "data", <StackSvg />)]),
  getItem(
    "Central Report Logs",
    "central-report-logs",
    <PaperSvg />,
    null,
    null,
    true
  ),
];

export const managerMenus = [getItem("Manage Brands", "brands", <UsersSvg />)];

export const brandManagerMenu = [
  getItem("Sales Analytics", "sales-analytics", <GraphSvg />, [
    getItem(
      "Sales",
      "sales",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "sales-analytics"
    ),
    getItem(
      "Sales by SKU",
      "sku",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "sales-analytics"
    ),
    getItem(
      "Sales by Product",
      "product",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "sales-analytics"
    ),
    getItem(
      "Sales by Week",
      "week",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "sales-analytics"
    ),
    getItem(
      "Sales by Month",
      "month",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "sales-analytics"
    ),
  ]),
  getItem(
    "Advertisement Analytics",
    "advertising-analytics",
    <ClipboardSvg />,
    [
      getItem(
        "Amazon Advertising",
        "advertising-data",
        <span className="menu-bullet">
          <span className="bullet bullet-dot" />
        </span>,
        null,
        "advertising-analytics"
      ),
      getItem(
        "Total Revenue ACoS",
        "total-revenue-acos",
        <span className="menu-bullet">
          <span className="bullet bullet-dot" />
        </span>,
        null,
        "advertising-analytics"
      ),
      ...(process.env.NEXT_PUBLIC_PRODUCTION === "true"
        ? []
        : [
            getItem(
              "Import Advertising data",
              "import",
              <span className="menu-bullet">
                <span className="bullet bullet-dot" />
              </span>,
              null,
              "advertising-analytics"
            ),
            getItem(
              "Import DSP Data",
              "import-dsp",
              <span className="menu-bullet">
                <span className="bullet bullet-dot" />
              </span>,
              null,
              "advertising-analytics"
            ),
          ]),
    ]
  ),
  getItem("Customer Acquisition", "customer-acquisition", <UserLgSvg />, [
    getItem(
      "New v/s Repeat",
      "new-vs-repeat",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "customer-acquisition"
    ),
    getItem(
      "Product Breakdown",
      "product-breakdown",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "customer-acquisition"
    ),
    getItem(
      "Category Breakdown",
      "category-breakdown",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "customer-acquisition"
    ),
    getItem(
      "LTV",
      "ltv",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "customer-acquisition"
    ),
    ...(process.env.NEXT_PUBLIC_PRODUCTION === "true"
      ? []
      : [
          getItem(
            "Import Shipment Data",
            "import-data",
            <span className="menu-bullet">
              <span className="bullet bullet-dot" />
            </span>,
            null,
            "customer-acquisition"
          ),
        ]),
  ]),
  getItem("Category Reports", "category-reports", <ClipboardSvg />, [
    getItem(
      "Category Performance Report",
      "category-performance-report",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "category-reports"
    ),
    getItem(
      "Product Report",
      "product-report",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "category-reports"
    ),
    getItem(
      "Category Product Data",
      "category-product-list",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "category-reports"
    ),
    getItem(
      "Manage Categories",
      "manage-categories",
      <span className="menu-bullet">
        <span className="bullet bullet-dot" />
      </span>,
      null,
      "category-reports"
    ),
  ]),
  // getItem("Inventory Management", "inventory-management", <UserLgSvg />, [
  //   getItem(
  //     "Inventory Planning",
  //     "planning",
  //     <span className="menu-bullet">
  //       <span className="bullet bullet-dot" />
  //     </span>,
  //     null,
  //     "inventory-management"
  //   ),
  //   getItem(
  //     "Restock Report",
  //     "restock-report",
  //     <span className="menu-bullet">
  //       <span className="bullet bullet-dot" />
  //     </span>,
  //     null,
  //     "inventory-management"
  //   ),
  // ]),

  getItem(
    "Central Log System",
    `central-log-system`,
    <PaperSvg />,
    null,
    null,
    true
  ),
  getItem(
    "Brand Settings",
    `brands/edit?activeTab=general`,
    <SettingsSvg />,
    null,
    null,
    true
  ),
];

export const userMenus = brandManagerMenu
  .filter(
    (i) =>
      i.key !== "central-log-system" &&
      i.key !== "brands/edit?activeTab=general"
  )
  .map((menu) => ({
    ...menu,
    children: menu.children?.filter((c) => !c.key.startsWith("import")),
  }));
