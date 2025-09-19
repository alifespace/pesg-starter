// src/components/MenuBar.tsx

import { Link, useLocation } from "react-router-dom";
import { Mountain } from "lucide-react"; // 一个不错的 logo 图标示例

// 导入 shadcn/ui 组件
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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

// import { cn } from "@/lib/utils";

// ★★★ 在这里配置您的导航链接 ★★★
const navLinks = [
  { href: "/dashboard", label: "仪表盘" },
  { href: "/wip", label: "进行中" },
  { href: "/products", label: "产品" },
  { href: "/about", label: "关于" },
  // 新增的外部链接
  {
    href: "/class.html", // 文件在 public 目录中，路径从根'/'开始
    label: "教程",
    isExternal: true, // 添加这个标志
  },
];

export function MenuBar() {
  const location = useLocation();

  // 模拟用户登录状态，您可以之后替换为真实的鉴权逻辑
  const isAuthenticated = true; // 您可以改成 false 看看效果

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* 1. 网站 Logo 和名称 */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Mountain className="h-6 w-6" />
          <span className="font-bold">My App</span>
        </Link>

        {/* 2. 主导航链接 (可配置) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                {/* ▼▼▼ 这是关键的修改 ▼▼▼ */}
                {link.isExternal ? (
                  // 如果是外部链接，渲染一个普通的 <a> 标签
                  <a
                    href={link.href}
                    // 建议在新标签页中打开外部链接
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.label}
                  </a>
                ) : (
                  // 否则，渲染 React Router 的 <Link> 组件
                  <Link to={link.href}>
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

        {/* 3. 右侧用户区域 */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isAuthenticated ? <UserProfile /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
}

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

export default MenuBar;
