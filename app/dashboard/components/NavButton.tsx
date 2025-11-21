import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import IconPicker from "./IconPicker";

type NavButtonProps = {
  href: string;
  icon: string;
  label?: string;
  compact?: boolean; // for mobile: show icon only
};

export default function NavButton({ href, icon, label, compact = false }: NavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Button
        variant="text"
        aria-current={isActive ? 'page' : undefined}
        sx={{
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          textTransform: 'none',
          justifyContent: compact ? 'center' : 'flex-start',
          width: compact ? 56 : 224,
          px: compact ? 0 : 2,
          py: compact ? 1 : 2,
        }}
      >
        <IconPicker icon={isActive ? icon : icon + 'Outlined'} sx={{ fontSize: compact ? 28 : 40, mr: compact ? 0 : 2 }} />
        {!compact && <Box component="span" sx={{ fontSize: 16 }}>{label}</Box>}
        {!compact && (
          <Box sx={{ ml: 'auto', width: 8, height: 56, backgroundColor: isActive ? 'white' : 'transparent', borderRadius: 1 }} />
        )}
      </Button>
    </Link>
  );
}
