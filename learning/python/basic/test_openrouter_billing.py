"""
测试当前 OpenRouter 的计费方式：
- BYOK (Bring Your Own Key): 请求透传到底层供应商，消耗你自己的 API 额度
- OpenRouter Credit: 通过 OpenRouter 的充值余额扣费

用法：
    # 用环境变量中的 OPENROUTER_API_KEY
    python test_openrouter_billing.py

    # 或手动指定 key
    python test_openrouter_billing.py YOUR_OPENROUTER_KEY_HERE
"""

import json
import os
import sys
import urllib.request
import urllib.error


def test_billing(api_key: str) -> None:
    """发送一次轻量请求到 OpenRouter，从响应头判断计费方式。"""
    url = "https://openrouter.ai/api/v1/chat/completions"

    payload = json.dumps({
        "model": "openai/gpt-4o-mini",  # 最便宜的模型之一，仅测试用
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 5,  # 极少量 token，几乎免费
    }).encode("utf-8")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        # 要求 OpenRouter 返回完整的计费头部
        "X-OpenRouter-Include-Billing": "1",
    }

    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            headers_dict = {k.lower(): v for k, v in resp.getheaders()}

        # ========== 计费方式判定 ==========
        print("=" * 60)
        print("🔍 OpenRouter 计费方式检测结果")
        print("=" * 60)

        # 1) 检查 X-OpenRouter-Credits-Used
        credits_used = headers_dict.get("x-openrouter-credits-used")
        if credits_used is not None:
            print(f"\n✅ 检测到 X-OpenRouter-Credits-Used: {credits_used}")
            try:
                val = float(credits_used)
                if val > 0:
                    print("   → 本次请求消耗了 OpenRouter Credits")
                    print("   → 计费方式: OPENROUTER CREDIT")
                else:
                    print("   → Credits = 0，可能为 BYOK 模式")
            except ValueError:
                pass
        else:
            print("\n⚠️  未返回 X-OpenRouter-Credits-Used 头部")

        # 2) 检查 X-OpenRouter-Billing
        billing = headers_dict.get("x-openrouter-billing")
        if billing is not None:
            print(f"\n✅ 检测到 X-OpenRouter-Billing: {billing}")
            if "credits" in billing.lower():
                print("   → 计费方式: OPENROUTER CREDIT")
            else:
                print("   → 计费方式: BYOK (透传到供应商)")
        else:
            print("\n⚠️  未返回 X-OpenRouter-Billing 头部")

        # 3) 检查其他相关头部
        for h, v in sorted(headers_dict.items()):
            if "billing" in h or "credit" in h or "token" in h or "cost" in h:
                print(f"\n📌 {h}: {v}")

        # 4) 检查回应体中的 usage 信息
        usage = body.get("usage", {})
        if usage:
            print(f"\n📊 Token 用量:")
            for k, v in usage.items():
                print(f"   {k}: {v}")

        # ========== 最终结论 ==========
        print("\n" + "-" * 60)
        if credits_used is not None:
            try:
                if float(credits_used) > 0:
                    print("🏁 结论: 当前使用 OPENROUTER CREDIT 计费")
                else:
                    print("🏁 结论: 当前使用 BYOK 计费")
            except ValueError:
                print("🏁 结论: 无法判断，请查看上述原始头部信息")
        elif billing:
            if "credits" in billing.lower():
                print("🏁 结论: 当前使用 OPENROUTER CREDIT 计费")
            else:
                print("🏁 结论: 当前使用 BYOK 计费")
        else:
            print("🏁 结论: 无法从响应头判断，请检查 OpenRouter Dashboard")
        print("-" * 60)

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP 错误 {e.code}: {e.read().decode('utf-8', errors='ignore')}")
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"❌ 网络错误: {e.reason}")
        sys.exit(1)


def main():
    # 从命令行参数或环境变量获取 API Key
    api_key = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("OPENROUTER_API_KEY")

    if not api_key:
        print("❌ 未提供 OpenRouter API Key！")
        print("\n用法:")
        print("  python test_openrouter_billing.py YOUR_OPENROUTER_KEY")
        print("  # 或设置环境变量: export OPENROUTER_API_KEY=sk-or-...")
        sys.exit(1)

    test_billing(api_key)


if __name__ == "__main__":
    main()