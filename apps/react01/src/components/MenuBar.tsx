// src/components/MenuBar.tsx

import * as React from "react"; // 导入 React 用于 forwardRef
import { Link, useLocation } from "react-router-dom";
import { Mountain } from "lucide-react";

// 导入 shadcn/ui 组件
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ★★★ 在这里配置您的导航链接 ★★★
const navLinks = [
  { href: "/dashboard", label: "仪表盘" },
  { href: "/wip", label: "进行中" },
  { href: "/products", label: "产品" },
  { href: "/about", label: "关于" },
  { href: "/shadcn/test01", label: "测试页面01" },
  {
    label: "Tailwind测试",
    isDropdown: true,
    children: [
      { 
        href: "/twc/test01", 
        label: "test01", 
        description: "这是第一个测试页面，路径为 /twc/test01" 
      },
      { 
        href: "/tailwind-test", 
        label: "Tailwind 功能演示", 
        description: "一个包含多种Tailwind功能的页面。" 
      },
      // 您可以在这里添加更多的下拉菜单项
    ],
  },
  { 
    href: "/class.html",
    label: "隐私政策", 
    isExternal: true
  },
];

export function MenuBar() {
  const location = useLocation();
  const isAuthenticated = true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        
        {/* 1. Logo (作为独立的 flex item) */}
        <Link to="/" className="flex items-center space-x-2">
          <Mountain className="h-6 w-6" />
          <span className="font-bold">My App</span>
        </Link>

        {/* 2. 主导航链接 (作为独立的 flex item) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                {link.isDropdown ? (
                  // 如果是下拉菜单，渲染 Trigger 和 Content
                  <>
                    <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                        {link.children?.map((child) => (
                          <ListItem key={child.label} to={child.href} title={child.label}>
                            {child.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : link.isExternal ? (
                  // 如果是外部链接，渲染 <a>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.label}
                  </a>
                ) : (
                  // 否则，渲染普通的 <Link>
                  <Link to={link.href!}>
                    <NavigationMenuLink
                      active={location.pathname === link.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* 3. 右侧组 (作为独立的 flex item) */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? <UserProfile /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
}

// ... UserProfile 和 SignInButton 组件保持不变 ...
// 用户已登录时显示的头像和下拉菜单
const UserProfile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>个人资料</DropdownMenuItem>
        <DropdownMenuItem>账单</DropdownMenuItem>
        <DropdownMenuItem>设置</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>退出登录</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 用户未登录时显示的按钮
const SignInButton = () => {
  return (
    <Link to="/signin">
      <Button>登录</Button>
    </Link>
  );
};


// 用于渲染下拉菜单中每一项的辅助组件
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MenuBar;

