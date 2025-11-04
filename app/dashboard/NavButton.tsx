import { autocompleteClasses, Box, Button, ButtonProps } from "@mui/material"
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
                boxSizing: "border-box",
                width: 285,
                pt:2,
                pb:2, 
                pl: 5, 
                pr: 0, 
                fontSize: 20,
                fontFamily: "'Urbanist', 'Helvetica', 'Arial', sans-serif",
                justifyContent: 'flex-start',
                alignItems: 'center',
                textTransform: 'none',
                borderWidth: 8,
            }
            }
            {...props}
        >
            <IconPicker icon={atButtonDestination ? name : name + 'Outlined'} sx={{fontSize: 60, pr: 3, }}/>
            {children}
            <Box 
                sx={{
                    backgroundColor: atButtonDestination ? 'white' : 'transparent',
                    width: 10,
                    height: 80,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    marginLeft: 'auto',
                }}
            />
        </Button>
        </Link>
    );
}
