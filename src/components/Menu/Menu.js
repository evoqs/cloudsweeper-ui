import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Box, Button } from '@mui/material';
import "./menu.css";

const Menu = () => {
  return (
    <div className="list row">
      <Button key="1" className="menu-button" href="/accounts">Accounts</Button>
      <Button key="2" className="menu-button" href="/pipelines">Pipelines</Button>
      <Button key="3" className="menu-button" href="/policies">Policies</Button>
      <Button key="4" className="menu-button" href="/reports">Reports</Button>
    </div>
  );
};

export default Menu;
