// src/pages/TailwindTestPage.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

function TailwindcssTest01() {
  const [buttonColor, setButtonColor] = useState('bg-primary');

  const handleButtonClick = () => {
    setButtonColor(prevColor => prevColor === 'bg-primary' ? 'bg-destructive' : 'bg-primary');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Tailwind CSS 测试页面
      </h1>
      <p className="text-muted-foreground">
        这是一个用于演示 Tailwind CSS 各种功能的页面，结合了 shadcn/ui 组件。
      </p>

      {/* Section 1: Flexbox 布局 */}
      <Card>
        <CardHeader>
          <CardTitle>Flexbox 布局</CardTitle>
          <CardDescription>使用 flex, justify-*, items-* 等。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div className="p-4 bg-primary text-primary-foreground rounded">Item 1</div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded">Item 2</div>
            <div className="p-4 bg-accent text-accent-foreground rounded">Item 3</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Grid 布局与响应式设计 */}
      <Card>
        <CardHeader>
          <CardTitle>Grid 布局与响应式</CardTitle>
          <CardDescription>
            在不同屏幕尺寸下改变列数。请尝试缩放浏览器窗口。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 bg-card-foreground/10 text-card-foreground rounded-lg aspect-square flex items-center justify-center">
                卡片 {index + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: 交互与状态 */}
      <Card>
        <CardHeader>
          <CardTitle>交互与状态</CardTitle>
          <CardDescription>
            组件可以根据用户操作或状态改变样式。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2">点击按钮切换颜色:</p>
            <Button 
              onClick={handleButtonClick}
              className={`${buttonColor} text-primary-foreground transition-colors duration-300`}
            >
              点击我
            </Button>
          </div>
          <div>
            <p className="mb-2">一个带样式的输入框:</p>
            <Input type="text" placeholder="输入一些文字..." className="max-w-sm"/>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: 动画与过渡 */}
      <Card>
        <CardHeader>
          <CardTitle>动画与过渡</CardTitle>
          <CardDescription>
            使用 hover:*, transition, animate-* 等。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-8">
            <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center
                          transition-all duration-300 ease-in-out 
                          hover:bg-primary hover:scale-110 hover:rotate-12 hover:shadow-2xl">
                <p className="text-secondary-foreground">悬停我</p>
            </div>
            <div className="flex items-center space-x-2">
                <p>一个旋转的图标:</p>
                <Star className="h-8 w-8 text-yellow-500 animate-spin" />
            </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default TailwindcssTest01;
