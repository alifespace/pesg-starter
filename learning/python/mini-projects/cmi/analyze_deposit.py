#!/usr/bin/env python3
"""
批量分析 Order Form 中的 Deposit（押金）条款
使用 LLM 自动提取押金类型、金额等关键信息

支持格式: .doc / .docx / .pdf（含扫描件自动 OCR）

用法:
    python analyze_deposit.py <文件或文件夹路径>

示例:
    python analyze_deposit.py "/path/to/Order Form.doc"
    python analyze_deposit.py "/path/to/Order Form.pdf"
    python analyze_deposit.py "/path/to/orders_folder/"
"""

import sys
import os
import re
import json
import glob
import subprocess
import argparse
from pathlib import Path
from datetime import datetime

# ── 读取 .env 文件（最高优先级）──
ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"  # learning/python/.env
if ENV_PATH.exists():
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                if v.strip():  # 只设置非空值
                    os.environ[k.strip()] = v.strip()

# ── 读取本地配置（优先级：命令行 > .env > llm_config.py）──
try:
    from llm_config import API_URL as _CFG_URL, API_KEY as _CFG_KEY, MODEL as _CFG_MODEL
    # 只在 .env 没有对应值时才使用 llm_config.py 的值
    API_URL = os.environ.get("XIAOMI_LLM_API_URL") or (_CFG_URL if "你的" not in _CFG_URL else "")
    API_KEY = os.environ.get("XIAOMI_LLM_API_KEY") or (_CFG_KEY if "你的" not in _CFG_KEY else "")
    MODEL = os.environ.get("XIAOMI_LLM_MODEL") or (_CFG_MODEL if "你的" not in _CFG_MODEL else "")
except ImportError:
    API_URL = os.environ.get("XIAOMI_LLM_API_URL", "")
    API_KEY = os.environ.get("XIAOMI_LLM_API_KEY", "")
    MODEL = os.environ.get("XIAOMI_LLM_MODEL", "")

# ──────────────────────────────────────────────
# 1. 文本提取
# ──────────────────────────────────────────────

def extract_text_from_doc(doc_path: str) -> str:
    """用 macOS textutil 提取 .doc/.docx 文本"""
    result = subprocess.run(
        ["textutil", "-convert", "txt", "-stdout", doc_path],
        capture_output=True, text=True, timeout=30
    )
    if result.returncode != 0:
        raise RuntimeError(f"textutil 提取失败: {result.stderr}")
    return result.stdout


def extract_text_from_pdf(pdf_path: str) -> str:
    """提取 PDF 文本，先尝试 pdfplumber，若内容太少则用 OCR"""
    import pdfplumber

    # 1. 先用 pdfplumber 提取文本
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text += page_text + "\n"
    except Exception as e:
        print(f"     ⚠️ pdfplumber 失败: {e}")

    # 2. 如果提取到的文本太少，可能是扫描件，用 OCR
    if len(text.strip()) < 50:
        print(f"     📷 文本过少，尝试 OCR 扫描...")
        text = ocr_pdf(pdf_path)

    return text


def ocr_pdf(pdf_path: str) -> str:
    """用 Tesseract OCR 处理扫描件 PDF"""
    import pytesseract
    from PIL import Image
    import pdfplumber

    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                # 将页面转为图片
                img = page.to_image(resolution=300)
                pil_img = img.original

                # OCR 识别
                page_text = pytesseract.image_to_string(pil_img, lang="eng")
                text += page_text + "\n"

                if (i + 1) % 5 == 0:
                    print(f"     📄 OCR 处理中... {i + 1}/{len(pdf.pages)} 页")
    except Exception as e:
        print(f"     ❌ OCR 失败: {e}")

    return text


def detect_doc_checkboxes(doc_path: str) -> str:
    """从 .doc 二进制数据中检测 checkbox 勾选状态，补充到文本末尾"""
    try:
        with open(doc_path, "rb") as f:
            data = f.read()

        import re as _re
        pattern = b"FORMCHECKBOX"
        positions = [m.start() for m in _re.finditer(pattern, data)]

        # deposit 相关关键词
        deposit_keywords = [b"Bank Guarantee", b"Cash Deposit", b"Nil"]

        results = []
        for pos in positions:
            after = data[pos + len(pattern):pos + len(pattern) + 6]
            # 判断勾选：\x14 = checked, \x15 = unchecked
            checked = b"\x14" in after[:3]

            # 跳过控制字节 (\x01, \x14, \x15, \x20 等)，找到标签文字
            label_start = 0
            while label_start < len(after) and after[label_start] < 0x41:  # 跳过控制字节和空格
                label_start += 1
            # 从标签位置向后读取可读文字
            label_area = data[pos + len(pattern) + label_start:pos + len(pattern) + label_start + 30]
            label_end = 0
            while label_end < len(label_area) and 0x41 <= label_area[label_end] <= 0x7A:
                label_end += 1
            # 也允许空格和斜杠
            label_text = label_area[:label_end].decode("ascii", errors="ignore").strip()

            # 只记录 deposit 相关的 checkbox
            if any(kw in label_text.encode() for kw in deposit_keywords):
                status = "✅ [CHECKED]" if checked else "☐ [UNCHECKED]"
                results.append(f"  {status} {label_text}")

        if results:
            return "\n\n--- Checkbox States (from binary) ---\n" + "\n".join(results)
    except Exception:
        pass
    return ""


def extract_text(file_path: str) -> str:
    """根据文件类型自动选择提取方式"""
    ext = Path(file_path).suffix.lower()
    if ext in (".doc", ".docx"):
        text = extract_text_from_doc(file_path)
        # 补充 checkbox 勾选状态
        checkbox_info = detect_doc_checkboxes(file_path)
        return text + checkbox_info
    elif ext == ".pdf":
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError(f"不支持的文件格式: {ext}")


def extract_all_docs(folder_path: str) -> dict[str, str]:
    """批量提取文件夹下所有支持的文件"""
    exts = ("*.doc", "*.docx", "*.pdf")
    files = []
    for ext in exts:
        files.extend(glob.glob(str(Path(folder_path) / ext)))

    docs = {}
    for f in sorted(files):
        name = Path(f).name
        try:
            docs[name] = extract_text(f)
            print(f"  ✅ {name}")
        except Exception as e:
            print(f"  ❌ {name}: {e}")
    return docs


# ──────────────────────────────────────────────
# 2. LLM 分析
# ──────────────────────────────────────────────

ANALYSIS_PROMPT = """You are a legal/contract analyst. Analyze this Order Form document and extract deposit/security information.

For each document, extract the following as JSON:
{{
  "document_name": "filename",
  "client_name": "customer/buyer company name",
  "has_deposit_clause": true/false,
  "deposit_type": "Bank Guarantee / Cash Deposit / Nil / Not Specified",
  "deposit_currency": "USD / HKD / etc or empty",
  "deposit_amount": number or null,
  "deposit_amount_text": "original text if amount found",
  "payment_terms": "payment due days etc",
  "monthly_charge": number or null,
  "one_off_charge": number or null,
  "currency": "USD / HKD etc",
  "deposit_conditions": "brief summary of deposit conditions if any",
  "remarks": "any other relevant notes about deposit/security"
}}

Rules:
- If deposit type is "Nil" (checkbox checked), this means NO deposit is required — set has_deposit_clause to false, deposit_type to "Nil"
- If deposit section exists but amount is blank/unfilled (and type is not Nil), set deposit_amount to null and has_deposit_clause to true
- If no deposit section at all, set has_deposit_clause to false
- Extract both one-off and monthly charges from the Service BOM / Charges sections
- Return ONLY valid JSON, no other text

Document text:
---
{doc_text}
---"""


def call_llm(doc_text: str, api_key: str, api_url: str, model: str) -> dict:
    """调用 OpenAI 兼容 API 分析文档"""
    import requests

    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": ANALYSIS_PROMPT.format(doc_text=doc_text[:15000])}
            ],
            "temperature": 0,
            "max_tokens": 4000,
        }

        resp = requests.post(f"{api_url}/chat/completions", headers=headers, json=payload, timeout=120)

        if resp.status_code != 200:
            print(f"   ⚠️ API 返回状态码 {resp.status_code}: {resp.text[:500]}")
            return {"error": f"HTTP {resp.status_code}", "raw": resp.text[:1000]}

        # 调试：打印原始响应文本的前 500 字符
        raw_text = resp.text
        print(f"   🔍 原始响应预览:\n{raw_text[:500]}{'...' if len(raw_text) > 500 else ''}")

        try:
            result_json = resp.json()
        except Exception as json_err:
            print(f"   ❌ resp.json() 解析失败: {json_err}")
            print(f"   🔍 原始文本: {raw_text[:1000]}")
            return {"error": f"JSON 解析失败: {json_err}", "raw": raw_text[:1000]}

        try:
            if "choices" not in result_json or not result_json["choices"]:
                print(f"   ⚠️ API 返回异常: {json.dumps(result_json, ensure_ascii=False)[:500]}")
                return {"error": "API 返回无 choices", "raw": json.dumps(result_json, ensure_ascii=False)[:1000]}

            content = result_json["choices"][0]["message"]["content"]
        except KeyError as e:
            print(f"   ❌ 响应结构异常 KeyError: {e}")
            print(f"   🔍 result_json 类型: {type(result_json)}")
            print(f"   🔍 result_json 键: {list(result_json.keys()) if isinstance(result_json, dict) else 'not a dict'}")
            return {"error": f"响应结构异常: {e}", "raw": json.dumps(result_json, ensure_ascii=False)[:1000] if isinstance(result_json, dict) else str(result_json)[:1000]}

        # 调试：显示原始返回的前 300 字符
        print(f"   📨 LLM 返回预览:\n{content[:300]}{'...' if len(content) > 300 else ''}")

        # 提取 JSON（可能被 markdown 包裹，或有额外文本）
        # 先尝试 ```json ... ``` 包裹的情况
        match = re.search(r"```json\s*\n([\s\S]*?)\n\s*```", content)
        if match:
            return json.loads(match.group(1))

        # 再尝试找最外层的 { ... }
        match = re.search(r"\{[\s\S]*\}", content)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                # 尝试修复常见的 JSON 问题（尾部逗号等）
                fixed = re.sub(r",\s*([}\]])", r"\1", match.group())
                try:
                    return json.loads(fixed)
                except json.JSONDecodeError:
                    # 最后手段：打印原始内容帮助调试
                    print(f"   ⚠️ JSON 解析失败，原始返回:\n{content[:500]}")
                    return {"error": "JSON 解析失败", "raw": content[:1000]}

        return {"error": "无法解析 LLM 返回", "raw": content[:1000]}

    except Exception as e:
        print(f"   ❌ 请求异常: {type(e).__name__}: {e}")
        return {"error": str(e)}


# ──────────────────────────────────────────────
# 3. 结果汇总
# ──────────────────────────────────────────────

def save_results(results: list[dict], output_path: str):
    """保存结果到 JSON 和 CSV"""
    # JSON
    json_path = output_path.replace(".csv", ".json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n📄 JSON: {json_path}")

    # CSV
    try:
        import pandas as pd
        df = pd.DataFrame(results)
        df.to_csv(output_path, index=False, encoding="utf-8-sig")
        print(f"📊 CSV:  {output_path}")

        # 也导出 Excel
        xlsx_path = output_path.replace(".csv", ".xlsx")
        df.to_excel(xlsx_path, index=False)
        print(f"📊 XLSX: {xlsx_path}")
    except ImportError:
        import csv
        if results:
            with open(output_path, "w", newline="", encoding="utf-8-sig") as f:
                writer = csv.DictWriter(f, fieldnames=results[0].keys())
                writer.writeheader()
                writer.writerows(results)
            print(f"📊 CSV:  {output_path}")


# ──────────────────────────────────────────────
# 4. 主程序
# ──────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="批量分析 Order Form 中的 Deposit 条款")
    parser.add_argument("path", help="单个文件 (.doc/.docx/.pdf) 或文件夹路径")
    parser.add_argument("--api-key", default=API_KEY or os.environ.get("XIAOMI_LLM_API_KEY", ""),
                        help="API Key (优先: 命令行 > llm_config.py > .env)")
    parser.add_argument("--api-url", default=API_URL or os.environ.get("XIAOMI_LLM_API_URL", "") or "https://openrouter.ai/api/v1",
                        help="API 端点 (优先: 命令行 > llm_config.py > .env)")
    parser.add_argument("--model", default=MODEL or os.environ.get("XIAOMI_LLM_MODEL", "") or "google/gemini-2.5-flash",
                        help="模型名称 (优先: 命令行 > llm_config.py > .env)")
    parser.add_argument("--output", default="deposit_analysis.csv",
                        help="输出文件名 (默认 deposit_analysis.csv)")
    args = parser.parse_args()

    if not args.api_key:
        print("❌ 请提供 API Key（三选一）:")
        print("   1. 命令行: --api-key sk-xxx")
        print("   2. 配置文件: 编辑 llm_config.py 中的 API_KEY")
        print("   3. 环境变量: export OPENROUTER_API_KEY=sk-xxx")
        sys.exit(1)

    print(f"🔧 使用配置:")
    print(f"   API URL: {args.api_url}")
    print(f"   Model:   {args.model}")

    # ── 提取文档 ──
    target = Path(args.path)
    if target.is_file():
        print(f"📄 提取文档: {target.name}")
        docs = {target.name: extract_text(str(target))}
    elif target.is_dir():
        print(f"📂 扫描文件夹: {target}")
        docs = extract_all_docs(str(target))
    else:
        print(f"❌ 路径不存在: {args.path}")
        sys.exit(1)

    if not docs:
        print("❌ 未找到 .doc/.docx 文件")
        sys.exit(1)

    print(f"\n🔍 共 {len(docs)} 个文档，开始 AI 分析...")

    # ── 逐个分析 ──
    results = []
    for name, text in docs.items():
        print(f"\n{'─'*50}")
        print(f"📝 分析: {name}")
        try:
            result = call_llm(text, args.api_key, args.api_url, args.model)
            result["document_name"] = name
            results.append(result)

            # 快速摘要
            has = result.get("has_deposit_clause", False)
            amt = result.get("deposit_amount")
            dtype = result.get("deposit_type", "N/A")
            status = "🔒 有押金" if has else "⚪ 无押金"
            print(f"   {status} | 类型: {dtype} | 金额: {amt or '未填写'}")
        except Exception as e:
            print(f"   ❌ 分析失败: {e}")
            results.append({"document_name": name, "error": str(e)})

    # ── 保存结果 ──
    output_path = str(target / args.output) if target.is_dir() else str(Path.cwd() / args.output)
    save_results(results, output_path)

    # ── 汇总 ──
    print(f"\n{'═'*50}")
    print(f"📊 分析汇总")
    print(f"{'═'*50}")
    total = len(results)
    with_deposit = sum(1 for r in results if r.get("has_deposit_clause"))
    no_deposit = total - with_deposit
    print(f"  📁 总文件数:   {total}")
    print(f"  🔒 有押金条款: {with_deposit}")
    print(f"  ⚪ 无押金条款: {no_deposit}")

    if with_deposit:
        print(f"\n  📋 有押金的文档:")
        for r in results:
            if r.get("has_deposit_clause"):
                amt = r.get("deposit_amount") or "未填写"
                print(f"    - {r['document_name']}: {r.get('deposit_type', 'N/A')} / {amt}")


if __name__ == "__main__":
    main()
