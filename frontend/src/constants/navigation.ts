export interface NavItem {
  title: string;
  href: string;
  iconName?: string;
  badge?: string;
  isExternal?: boolean;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { title: "Explore", href: "/explore" },
  { title: "Categories", href: "/categories" },
  { title: "Docs", href: "/docs" },
  { title: "Blog", href: "/blog" },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { title: "Explore", href: "/explore" },
  { title: "My Skills", href: "/skills" },
  { title: "Saved", href: "/saved" },
  { title: "Dashboard", href: "/dashboard" },
];

export const DASHBOARD_SIDEBAR_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", iconName: "LayoutDashboard" },
  { title: "My Skills", href: "/skills", iconName: "Boxes" },
  { title: "Create Skill", href: "/skills/new", iconName: "PlusCircle" },
  { title: "Import from GitHub", href: "/github-import", iconName: "Github" },
  { title: "Saved", href: "/saved", iconName: "Bookmark" },
  { title: "Collections", href: "/collections", iconName: "FolderHeart" },
  { title: "Profile", href: "/settings/profile", iconName: "User" },
  { title: "Settings", href: "/settings", iconName: "Settings" },
];

export const DASHBOARD_FOOTER_ITEMS: NavItem[] = [
  { title: "Documentation", href: "/docs", iconName: "BookOpen" },
  { title: "Help & Community", href: "https://github.com", isExternal: true, iconName: "HelpCircle" },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { title: "Home", href: "/", iconName: "Home" },
  { title: "Explore", href: "/explore", iconName: "Compass" },
  { title: "Create", href: "/skills/new", iconName: "PlusCircle" },
  { title: "Saved", href: "/saved", iconName: "Bookmark" },
  { title: "Dashboard", href: "/dashboard", iconName: "LayoutDashboard" },
];
