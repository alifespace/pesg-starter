import platform
import time

import torch


def main() -> None:
    print("=" * 60)
    print("Remote environment")
    print("=" * 60)
    print(f"Python platform: {platform.platform()}")
    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")

    if not torch.cuda.is_available():
        raise RuntimeError("没有检测到 CUDA GPU")

    device = torch.device("cuda")
    gpu_name = torch.cuda.get_device_name(0)

    print(f"GPU: {gpu_name}")
    print(f"CUDA version: {torch.version.cuda}")

    # 创建两个矩阵并在 GPU 上相乘
    matrix_size = 4096
    print(f"\nRunning {matrix_size} x {matrix_size} matrix multiplication...")

    a = torch.randn(matrix_size, matrix_size, device=device)
    b = torch.randn(matrix_size, matrix_size, device=device)

    # 预热 GPU
    _ = a @ b
    torch.cuda.synchronize()

    start = time.perf_counter()
    result = a @ b
    torch.cuda.synchronize()
    elapsed = time.perf_counter() - start

    print(f"Elapsed: {elapsed:.4f} seconds")
    print(f"Result checksum: {result.mean().item():.6f}")
    print("\nColab GPU execution succeeded.")


if __name__ == "__main__":
    main()