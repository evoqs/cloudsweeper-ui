import { Button } from '@mui/material';
import "./menu.css";
import { GrScheduleNew, GrCloudSoftware, GrCli } from "react-icons/gr";

const Menu = () => {
  return (
    <div className="list row">
      <br /><br />
      <span><Button key="1" className="menu-button" href="/accounts"><GrCloudSoftware className='menu-icon' /> Accounts</Button></span>
      <span><Button key="2" className="menu-button" href="/pipelines"><GrScheduleNew className='menu-icon' /> Pipelines</Button></span>
      <span><Button key="3" className="menu-button" href="/policies"><GrCli className='menu-icon' /> Policies</Button></span>
    </div>
  );
};

export default Menu;
