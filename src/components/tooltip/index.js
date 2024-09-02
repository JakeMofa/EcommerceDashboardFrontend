import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import './style.module.css';

const VendoTooltip = (props) => {
  const { loading, rule, title, placement, children, row = 1, ...rest } = props;
  const [visible, setVisible] = useState(false);
  let container;
  const handleVisibleChange = (_visible) => {
    if (rule === undefined || rule === null) {
      setVisible(_visible);
    }
    if (row && (container && container.clientHeight < container.scrollHeight)) {
      setVisible(_visible);
    }
    if (container && container.clientWidth < container.scrollWidth) {
      setVisible(_visible);
    }
  };
  useEffect(() => {
    if (loading === false) {
      setVisible(false);
    }
  }, [loading]);

  const verticalStyle = {
    WebkitLineClamp: row,
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
  };

  return (
    <Tooltip
      mouseLeaveDelay={0}
      mouseEnterDelay={0.15}
      destroyTooltipOnHide
      placement={placement || "bottom"}
      open={visible}
      title={title || children}
      arrow
      onOpenChange={handleVisibleChange}
    >
      <div
        ref={(node) => (container = node)}
        data-test={`_${title}`}
        style={row ? { ...verticalStyle } : {}}
        className={` ${row ? 'line-clamp' : 'tooltipBox'}`}
        {...rest}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default VendoTooltip;
