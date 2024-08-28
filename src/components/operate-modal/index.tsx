import React from "react";
import { Modal, ModalProps } from "antd";
import "./index.css";

interface CustomModalProps
  extends Omit<ModalProps, "title" | "footer" | "centered" | "subTitle"> {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  subTitle?: string;
  centered?: boolean;
}

const OperateModal: React.FC<CustomModalProps> = ({
  title,
  footer,
  centered = true,
  subTitle = "",
  ...modalProps
}) => {
  return (
    <Modal
      className="customModal"
      classNames={{
        body: "custom-modal-body",
        header: "custom-modal-header",
        footer: "custom-modal-footer",
        content: "custom-modal-content",
      }}
      title={
        <>
          <span>{title}</span>
          {subTitle && (
            <span
              style={{
                color: "var(--color-text-3)",
                fontSize: "12px",
                fontWeight: "normal",
              }}
            >
              {" "}
              - {subTitle}
            </span>
          )}
        </>
      }
      footer={footer}
      centered={centered}
      {...modalProps}
    />
  );
};

export default OperateModal;
