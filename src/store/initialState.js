const initialState = {
  users: {
    userList: {
      items: [],
      count: 0,
      page: 1,
      limit: 10,
    },
    switchUser: {},
  },
  brands: {
    userBrandList: {
      data: [],
      status: false,
    },
    brandList: {
      data: [],
      count: 0,
      page: 1,
      limit: 10,
    },
    amazonSpApiCredentials: {
      status: false,
      data: [],
    },
    amazonAdvertisingCredentials: {
      status: false,
      data: [],
    },
  },
  customerAcquisitionMonthly: {
    status: false,
    data: {
      list: [],
      total: {},
    },
  },
  customerAcquisitionWeekly: {
    status: false,
    data: {
      list: [],
      total: {},
    },
  },
  customerAcquisitionLTV: {
    predictiveLTV: {
      status: false,
      data: 0,
    },
    LTV: {
      status: false,
      data: {
        total: {},
        list: [],
      },
    },
  },
  customerAcquisitionBreakdownMonthly: {
    items: [],
    status: null,
    count: 0,
    page: 1,
    limit: 10,
    total: [],
  },
  customerAcquisitionBreakdownWeekly: {
    items: [],
    status: null,
    count: 0,
    page: 1,
    limit: 10,
    total: [],
  },
  customerAcquisitionCategoryBreakdownMonthly: {
    status: false,
    data: [],
  },
  customerAcquisitionCategoryBreakdownWeekly: {
    status: false,
    data: [],
  },
  sales: {
    salesGraphData: {
      data: [],
      status: null,
    },
    salesByWeekData: {},
    salesStats: {},
    salesReportCallOuts: {},
  },
  salesBySku: {
    salesSkuDetailsList: {
      status: null,
      items: [],
      count: 0,
      page: 1,
      limit: 10,
      order: "desc",
      orderBy: "id",
    },
    salesBySkuDetails: {
      status: null,
      data: {},
    },
    salesBySkuGraphData: {
      status: null,
      data: [],
    },
  },
  salesByProduct: {
    salesByProductList: {
      status: null,
      list: [],
      count: 0,
      page: 1,
      limit: 10,
      order: "desc",
      orderBy: "id",
    },
    saveColumnConfiguration: {},
    salesByProductColumnList: {},
    saveTableConfiguration: {},
  },
  poTemplate: {
    status: false,
    data: [],
  },
  advertising: {
    graphData: {
      status: true,
      data: {
        campaign: {},
        dates: [],
      },
    },
    lastWeekKPIs: {
      status: false,
      data: {},
    },
    yearToDayKPIs: {
      status: false,
      data: {},
    },
    advertisements: {
      status: false,
      data: [],
    },
    campaignData: {
      status: false,
      data: [],
    },
  },
  advertisingTotalRevenue: {
    list: {
      status: null,
      data: [],
    },
  },
  salesByWeek: {
    salesWeekDetailList: {
      status: null,
      data: [],
      summary: {},
    },
    graphAsinList: {
      status: null,
      data: {
        astr_child_asin: [],
        astr_listing_sku: [],
        astr_parent_asin: [],
      },
    },
    salesWeekGraph: {
      status: null,
      data: {},
    },
    salesWeekData: {
      status: null,
      data: {},
    },
    salesSelectedWeekDetail: {
      data: [],
      status: false,
    },
  },
  categoryPerformanceReport: {
    categoryPerformanceList: {
      status: null,
      categories: [],
      grandTotal: {
        shipped_revenue: 0,
        TACoS: 0,
        ad_sales: 0,
        ad_spend: 0,
      },
      intervalTotal: [],
    },
  },
  productReportList: {
    categoriesData: {
      data: [],
      paginated: false,
      status: null,
    },
    categoryProductsData: {
      items: [],
      status: null,
      count: 0,
      page: 1,
      limit: 10,
    },
  },
  categoryProductList: {
    items: [],
    status: null,
    count: 0,
    page: 1,
    limit: 10,
  },
  asinAndSkuList: {
    asin: {
      list: [],
      status: null,
    },
    sku: {
      list: [],
      status: null,
    },
  },
  categoryList: {
    data: [],
    status: null,
    noBrandRelated: { data: [], status: null },
    categorySpecificBrand: {},
  },
  salesByMonth: {
    salesByMonthData: {
      status: null,
      data: {},
    },
    salesByMonthDetail: {
      status: null,
      data: [],
      summary: {},
    },
    salesByMonthGraph: {
      status: null,
      data: [],
    },
    graphAsinList: {
      status: null,
      data: {
        astr_child_asin: [],
        astr_listing_sku: [],
        astr_parent_asin: [],
      },
    },
    salesSelectedMonthDetail: {
      data: [],
      status: false,
    },
  },
  planning: {
    inventoryPlaning: {},
    inventoryPlaningColumnsList: {},
    inventoryPlaningColumnsSave: {},
  },
  shipping: {
    shippingList: {
      items: [],
    },
  },
  inventoryDashboard: {
    data: [],
    status: false,
  },
  reportLogs: {
    reportLogsData: {
      data: [],
      count: 0,
      page: 1,
      limit: 10,
      status: false,
    },
    reportLogsSummary: {
      data: [],
      status: false,
    },
  },
  centralReportLogs: {
    logsList: {
      results: [],
      count: 0,
      page: 1,
      limit: 10,
      status: false,
    },
  },
  inventoryRestockReport: {
    list: {
      data: [],
      status: false,
    },
  },
};

export default initialState;
