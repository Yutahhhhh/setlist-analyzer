"use client";
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  AppBar,
  IconButton,
  Typography,
  Drawer
} from "@mui/material";
import React, { useState } from "react";
import ListIcon from '@mui/icons-material/List';
import MenuIcon from "@mui/icons-material/Menu";
import MusicIcon from "@mui/icons-material/MusicNote";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"
import TrackControlBar from "@/components/tracks/TrackControlBar";
import { useJobStore } from "@/store/useJobStore";
import JobAlert from "@/components/JobAlert";
const drawerWidth = 240;
const LINKS: { text: string; href: string; icon: React.ReactNode }[] = [
  { text: "解析済み", href: "/", icon: <MusicIcon /> },
  { text: "ファイル一覧", href: "/list/", icon: <ListIcon /> },
  { text: "トレーニング", href: "/train/", icon: <ModelTrainingIcon /> }
];

interface Props {
  children: React.ReactNode;
}

const ResponsiveDrawer: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { allJobs } = useJobStore();
  const { children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const activeLinkText =
    LINKS.find((link) => link.href === pathname)?.text ||
    "Responsive Drawer";
  const runningJobs = allJobs.filter((job) => job.isRunning);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const drawer: React.ReactNode = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {LINKS.map((l, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => router.push(l.href)}>
              <ListItemIcon>{l.icon}</ListItemIcon>
              <ListItemText primary={l.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {runningJobs.map((job, index) => (
        <JobAlert key={index} job={job} />
      ))}
    </div>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {activeLinkText}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerClose}
            onTransitionEnd={handleDrawerTransitionEnd}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
      <TrackControlBar />
    </>
  );
}

export default ResponsiveDrawer