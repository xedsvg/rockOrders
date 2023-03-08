import React, { useState, useEffect } from "react";
import { Button } from "native-base";

const Categories = ({ category }) => {
  return <Button>{category}</Button>;
};

export default Categories;
