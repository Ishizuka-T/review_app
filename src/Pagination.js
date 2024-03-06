// ラップして渡した方がいいのでもう使うのをやめた。
import React from 'react';

function Pagination({ currentPage, setCurrentPage }) {
  return (
    <div>
      {currentPage > 1 && (<button onClick={() => setCurrentPage(currentPage - 1)}>前へ</button>)}
      <button onClick={() => setCurrentPage(currentPage + 1)}>次へ</button>
    </div>
  );
}

export default Pagination;