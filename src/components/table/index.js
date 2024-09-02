import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Table, theme } from "antd";
import ResizeObserver from "rc-resize-observer";
import { VariableSizeGrid as Grid } from "react-window";
import classNames from "classnames";
import ResizableTitle from "./Resizeable";

const ASINTable = (props) => {
  const {
    columns,
    fixed,
    dataSource,
    rowKey,
    loading,
    pagination,
    scrollX,
    scrollY,
    isCheckBoxRow,
    rowSelection,
    onChange,
    ellipsis = false,
    scroll,
    rowHeight = 54,
    virtual = false,
    resizable = false,
    id,
    ...rest
  } = props;

  const [cColumns, setCColumns] = useState([]);

  const synced = useMemo(
    () => JSON.parse(localStorage.getItem(`table-${id}`)),
    [id]
  );

  const allColumns = useMemo(() => {
    let res = [];
    const findColumn = (array) => {
      array.forEach((item) => {
        if (item.children?.length > 0) {
          findColumn(item.children);
        } else {
          res.push(item);
        }
      });
      return res;
    };
    findColumn(columns);
    return res.filter(Boolean);
  }, [columns]);

  useEffect(() => {
    if (id && synced) {
      setCColumns(
        columns.map((item, key) => {
          return {
            ...item,
            width: synced?.[key]?.width || item?.width,
            defaultWidth: item?.width,
            children: item?.children?.map((child, index) => {
              return {
                ...child,
                defaultWidth: child?.width,
                width:
                  synced?.[key]?.["children"]?.[index]?.width || child?.width,
              };
            }),
          };
        })
      );
    } else {
      setCColumns(columns);
    }
  }, [columns, id, synced]);

  const [tableWidth, setTableWidth] = useState(0);
  const { token } = theme.useToken();
  const gridRef = useRef();

  const widthColumnCount = cColumns.filter(({ width }) => !width).length;

  const mergedColumns = cColumns.map((column) => {
    if (column.width) {
      const width =
        typeof column?.width === "string"
          ? Number(column?.width?.replace("px", ""))
          : column?.width;

      return { ...column, width: width ? width : undefined };
    }
    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);
  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * rowHeight;
    return (
      <Grid
        estimatedRowHeight={rowHeight}
        height={scroll.y}
        rowHeight={() => rowHeight}
        width={tableWidth}
        ref={gridRef}
        className="virtual-grid"
        columnCount={allColumns.length}
        columnWidth={(index) => {
          const { width } = allColumns[index];
          return totalHeight > scroll?.y && index === allColumns.length - 1
            ? width - scrollbarSize - 1
            : width;
        }}
        rowCount={rawData.length}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          const node =
            rawData[rowIndex][allColumns[columnIndex].dataIndex] ||
            allColumns[columnIndex]?.render?.(rawData[rowIndex]);

          return (
            <div
              className={classNames("virtual-table-cell", {
                "virtual-table-cell-last":
                  columnIndex === allColumns.length - 1,
              })}
              style={{
                ...style,
                boxSizing: "border-box",
                padding: token.padding,
                borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
                background: token.colorBgContainer,
              }}
            >
              {node}
            </div>
          );
        }}
      </Grid>
    );
  };

  const handleResize =
    (index) =>
    (e, { size }) => {
      setCColumns((columns) => {
        const nextColumns = [...columns];
        if (Array.isArray(index)) {
          const [fIndex, secondIndex] = index;
          nextColumns[fIndex]["children"][secondIndex] = {
            ...nextColumns[fIndex]["children"][secondIndex],
            width: size.width,
          };
          return nextColumns;
        } else {
          const hasChildren = nextColumns[index]?.["children"];

          if (hasChildren) {
            hasChildren[hasChildren.length - 1] = {
              ...hasChildren?.[hasChildren?.length - 1],
              width: size.width,
            };
            return nextColumns;
          } else {
            nextColumns[index] = {
              ...nextColumns[index],
              width: size.width,
            };
            return nextColumns;
          }
        }
      });
    };

  const handleReset = (index) => {
    setCColumns((columns) => {
      const nextColumns = [...columns];
      if (Array.isArray(index)) {
        const [fIndex, secondIndex] = index;
        nextColumns[fIndex]["children"][secondIndex] = {
          ...nextColumns[fIndex]["children"][secondIndex],
          width: nextColumns[fIndex]["children"][secondIndex]?.defaultWidth,
        };
        return nextColumns;
      } else {
        const hasChildren = nextColumns[index]?.["children"];

        if (hasChildren) {
          hasChildren[hasChildren.length - 1] = {
            ...hasChildren?.[hasChildren?.length - 1],
            width: hasChildren?.[hasChildren?.length - 1]?.defaultWidth,
          };
          return nextColumns;
        } else {
          nextColumns[index] = {
            ...nextColumns[index],
            width: nextColumns[index]?.defaultWidth,
          };
          return nextColumns;
        }
      }
    });
  };

  const recursiveColumnApplier = useCallback(
    (col, index) => {
      return {
        ...col,
        ellipsis: col?.ellipsis || ellipsis,
        onHeaderCell: resizable
          ? (column) => ({
              width: column.width,
              onResize: handleResize(index),
              onReset: handleReset,
              id: index,
            })
          : undefined,
      };
    },
    [ellipsis, resizable]
  );

  const alteredTableColumn = useMemo(() => {
    const cols = (mergedColumns || []).reduce((acc, col, index) => {
      let temp = {};
      if (col.children) {
        const children = col.children.map((item, key) => {
          return recursiveColumnApplier(item, [index, key]);
        });
        temp["children"] = children;
      }
      temp = { ...recursiveColumnApplier(col, index), ...temp };
      acc.push(temp);
      return acc;
    }, []);
    if (id) {
      localStorage.setItem(`table-${id}`, JSON.stringify(cols));
    }
    return cols;
  }, [id, mergedColumns, recursiveColumnApplier]);

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        className="virtual-table"
        columns={alteredTableColumn}
        fixed={fixed}
        dataSource={dataSource?.map((d, i) => {
          return { ...d, key: i };
        })}
        components={{
          body: virtual ? renderVirtualList : undefined,
          header: {
            cell: resizable ? ResizableTitle : undefined,
          },
        }}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        scroll={scroll}
        rowSelection={
          isCheckBoxRow
            ? {
                type: "checkbox",
                ...rowSelection,
              }
            : ""
        }
        {...rest}
      />
    </ResizeObserver>
  );
};

export default ASINTable;
