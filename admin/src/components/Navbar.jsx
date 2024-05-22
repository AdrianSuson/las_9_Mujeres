import { useState } from "react";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { logout } from "../state/logoutAction";
import ChangeCredentials from "./acount";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, setUsername }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleAccount = () => setAccountOpen(!accountOpen);

  const handleLogout = () => {
    localStorage.clear(); 
    dispatch(logout());
    window.location.reload(false);
    navigate("/admin", { replace: true });
  };

  return (
    <AppBar position="static" sx={{ background: "none", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Sidebar Toggle */}
        <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MenuIcon />
        </IconButton>

        {/* Settings and Account Management */}
        <Button onClick={handleClick} style={{ color: "black" }}>
          <SettingsIcon />
        </Button>
        <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
          <MenuItem onClick={toggleAccount}>
            <AccountCircleIcon sx={{ marginRight: 1 }} /> Account
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon sx={{ marginRight: 1 }} /> Log Out
          </MenuItem>
        </Menu>

        {/* Account Dialog */}
        <Dialog open={accountOpen} onClose={toggleAccount}>
          <DialogContent>
            <ChangeCredentials setUsername={setUsername} />
          </DialogContent>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};
Navbar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  setUsername: PropTypes.func,
};
export default Navbar;
