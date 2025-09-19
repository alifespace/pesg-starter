import {Button} from "@/components/ui/button";
import { LucideMinimize } from "lucide-react";


function ShadcnTest01() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center rounded-lg border-2 border-dashed">
      <h2>测试页面</h2>
       
      <Button variant="destructive" size="lg" className="rounded-full" onClick={() => alert('点击了按钮')}><LucideMinimize />Click me</Button>
    </div>
  );
}

export default ShadcnTest01;
