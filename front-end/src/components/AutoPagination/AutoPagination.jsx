import React, { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

export default function AutoPagintaion({
  currPage,
  totalPages,
  maxLeftPages,
  maxRightPages,
  toPage,
  toNextPage,
  toPrevPage,
  ...props
}) {
  const [leftBound, setLeftBound] = useState(1);
  const [rightBound, setRightBound] = useState(maxLeftPages + maxRightPages + 1);

  useEffect(() => {
    if (currPage >= rightBound || currPage <= leftBound) {
      let newLeftBound = currPage - maxLeftPages;
      let newRightBound = currPage + maxRightPages;
      setLeftBound(newLeftBound > 1 ? newLeftBound : 1);
      setRightBound(newRightBound < totalPages ? newRightBound : totalPages);
    }
  }, [currPage, totalPages]);

  const renderInnerNavigation = () => {
    return (
      <React.Fragment>
        {leftBound === 1 ? null : <Pagination.Ellipsis disabled />}
        {[...Array(rightBound - leftBound + 1).keys()].map((i) => {
          const j = i + leftBound;
          return (
            <Pagination.Item active={j === currPage} onClick={() => toPage(j)} key={j}>
              {j}
            </Pagination.Item>
          );
        })}
        {rightBound === totalPages ? null : <Pagination.Ellipsis disabled />}
      </React.Fragment>
    );
  };

  return (
    <Pagination>
      <Pagination.First onClick={() => toPage(1)} />
      <Pagination.Prev onClick={() => toPrevPage()} />
      {renderInnerNavigation()}
      <Pagination.Next onClick={() => toNextPage()} />
      <Pagination.Last onClick={() => toPage(totalPages)} />
    </Pagination>
  );
}
