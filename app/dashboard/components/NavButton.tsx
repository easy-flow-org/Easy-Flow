import { Box, Button, ButtonProps, useMediaQuery } from "@mui/material"
import Link from "next/link";
import { Urbanist } from 'next/font/google';
import { usePathname } from 'next/navigation';
import IconPicker from "./IconPicker";

const urbanist = Urbanist({ subsets: ['latin'] });

export default function NavButton({ children, icon, href, ...props }: ButtonProps & { icon: string, href: string }) {

  const pathname = usePathname();
  const atButtonDestination: boolean = pathname === href;
  const isMobile = useMediaQuery('(max-width:1000px)');

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Button
        variant="text"
        sx={{
          color: 'white',
          boxSizing: "border-box",
          width: isMobile ? 40 : 228,
          pt: 2,
          pb: isMobile ? 0 : 2,
          pl: isMobile ? 0 : 4,
          pr: 0,
          fontSize: 16,
          fontFamily: "'Urbanist', 'Helvetica', 'Arial', 'sans-serif'",
          alignItems: 'center',
          textTransform: 'none',
          borderWidth: 7,

          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
        }
        }
        {...props}
      >
        <IconPicker icon={atButtonDestination ? icon : icon + 'Outlined'} sx={{ fontSize: isMobile ? 32 : 48, pr: isMobile ? 0 : 3, }} />
        {children}
        <Box
          sx={{
            backgroundColor: atButtonDestination ? 'white' : 'transparent',
            width: isMobile ? 64 : 8,
            height: isMobile ? 2 : 64,
            mt: isMobile ? 1 : 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: isMobile ? 10 : 0,
            borderBottomLeftRadius: isMobile ? 0 : 10,
            marginLeft: 'auto',
          }}
        />
      </Button>
    </Link>
  );
}
