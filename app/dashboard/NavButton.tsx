import { Button, ButtonProps } from "@mui/material"
import Link from "next/link";
import { SpaceDashboardOutlined, SpaceDashboard } from "@mui/icons-material"
import { Urbanist } from 'next/font/google';
import IconPicker from "./IconPicker";
import { usePathname } from 'next/navigation';

const urbanist = Urbanist({ subsets: ['latin'] });

export default function NavButton({children, icon, href, ...props}: ButtonProps & {icon: string, href: string}) {

    let name: string = icon;
    const pathname = usePathname();
    const atButtonDestination: boolean = pathname === href;

    return (
        <Link href={href}>
        <Button 
            variant="text" 
            sx={{
                color: 'white', 
                pt:2,
                pb:2, 
                pl: 5, 
                pr: 10, 
                fontSize: 20,
                fontFamily: "'Urbanist', 'Helvetica', 'Arial', sans-serif",
                justifyContent: 'flex-start',
                alignItems: 'center',
                textTransform: 'none',
                borderWidth: 8,
                // borderRightStyle: atButtonDestination ? 'solid' : 'none', /* need to tweak visual before enabling */
            }
            }
            {...props}
        >
            <IconPicker icon={atButtonDestination ? name : name + 'Outlined'} sx={{fontSize: 60, pr: 3, }}/>
            {children}
        </Button>
        </Link>
    );
}

// simply create onclick to change name to include/exclude 'outlined'