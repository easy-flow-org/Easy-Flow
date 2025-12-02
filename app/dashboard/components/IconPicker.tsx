import { SpaceDashboardOutlined, SpaceDashboard, CalendarMonthOutlined, CalendarMonth, OfflineBoltOutlined, OfflineBolt, AutoStories, AutoStoriesOutlined, FolderSpecial, FolderSpecialOutlined } from "@mui/icons-material"
import { SxProps } from "@mui/material";

export default function IconPicker({ icon, ...props }: {icon: String, sx?: SxProps}) {


    switch (icon) {
        case "SpaceDashboardOutlined":
            return <SpaceDashboardOutlined {...props}/>;
        case "SpaceDashboard":
            return <SpaceDashboard {...props}/>;
        case "CalendarMonth":
            return <CalendarMonth {...props}/>;
        case "CalendarMonthOutlined":
            return <CalendarMonthOutlined {...props}/>;
        case "OfflineBolt":
            return <OfflineBolt {...props}/>;
        case "OfflineBoltOutlined":
            return <OfflineBoltOutlined {...props}/>;
        case "AutoStories":
            return <AutoStories {...props}/>;
        case "AutoStoriesOutlined":
            return <AutoStoriesOutlined {...props}/>;
        case "FolderSpecial":
            return <FolderSpecial {...props}/>;
        case "FolderSpecialOutlined":
            return <FolderSpecialOutlined {...props}/>;
    }
}

// <NavButton href='/dashboard/courses' icon='AutoStories'>Courses</NavButton>