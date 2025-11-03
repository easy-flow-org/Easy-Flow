import { Button, ButtonProps } from "@mui/material"
import Link from "next/link";
import { SpaceDashboardRounded, SpaceDashboardOutlined, SpaceDashboard } from "@mui/icons-material"
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'] });

export default function NavButton({children, ...props}: ButtonProps) {


    return (
        <Link href='/dashboard'>
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
            }
            }
            {...props}
        >
            <SpaceDashboardOutlined sx={{fontSize: 60, pr: 3}}/>
            {children}
        </Button>
        </Link>
    );
}