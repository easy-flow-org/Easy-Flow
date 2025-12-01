import { SpaceDashboardOutlined, SpaceDashboard, CalendarMonthOutlined, CalendarMonth, OfflineBoltOutlined, OfflineBolt } from "@mui/icons-material"
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
    }
}