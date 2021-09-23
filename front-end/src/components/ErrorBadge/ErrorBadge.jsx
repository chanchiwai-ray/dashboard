import React, { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

import styles from "./ErrorBadge.module.css";

export default function ErrorBadge({ message, onClose, timeout, ...props }) {
  useEffect(() => {
    if (timeout) {
      const timedClose = setTimeout(() => {
        if (onClose) onClose();
      }, timeout);
      return () => clearTimeout(timedClose);
    }
  }, []);

  return (
    <div className={`${styles["error-badge"]}`}>
      <FontAwesomeIcon icon={faExclamationCircle} />
      <span className="px-2">{message}</span>
      <FontAwesomeIcon
        icon={faTimesCircle}
        className={`${styles["fontawesome-as-btn"]} ml-auto`}
        onClick={() => {
          if (onClose) {
            onClose();
          }
        }}
      />
    </div>
  );
}
