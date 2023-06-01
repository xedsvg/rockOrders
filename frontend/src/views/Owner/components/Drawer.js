import React, { useEffect } from "react";

function Drawer({ ...props }) {
  useEffect(() => {}, []);

  return (
    <div {...props}>
      <nav id="drawer">
        <ul>
          <li>
            <a href="#">Menu Item</a>
          </li>
          <li>
            <a href="#">Menu Item</a>
          </li>
          <li>
            <a href="#">Menu Item</a>
          </li>
          <li>
            <a href="#">Menu Item</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Drawer;
