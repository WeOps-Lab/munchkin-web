import React from "react";
import { Table, TableProps } from "antd";

interface CustomTableProps extends Omit<TableProps, "bordered" | "size"> {
  bordered?: boolean;
  size?: "large" | "middle" | "small";
}

const CommonTable: React.FC<CustomTableProps> = ({
  // 可在此处统一设置表格某属性的默认值，如果传该属性，以传入为准
  bordered = false,
  size = "large",
  ...TableProps
}) => {
  return <Table bordered={bordered} size={size} {...TableProps} />;
};

export default CommonTable;
