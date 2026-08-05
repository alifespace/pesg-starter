#!/usr/bin/env python3
"""
CPU Benchmark - Matrix Operations
测试矩阵运算性能，评估CPU计算能力
"""

import time
import numpy as np
from typing import Tuple


def benchmark_matrix_multiply(n: int, iterations: int = 5) -> dict:
    """测试 NxN 矩阵乘法性能"""
    times = []
    
    for _ in range(iterations):
        A = np.random.rand(n, n)
        B = np.random.rand(n, n)
        
        start = time.perf_counter()
        C = A @ B
        elapsed = time.perf_counter() - start
        times.append(elapsed)
    
    avg_time = np.mean(times)
    flops = 2 * n**3 / avg_time  # 矩阵乘法 FLOPS
    return {
        "size": f"{n}x{n}",
        "avg_time_ms": avg_time * 1000,
        "flops_gflops": flops / 1e9
    }


def benchmark_matrix_decomposition(n: int, iterations: int = 5) -> dict:
    """测试矩阵分解性能 (LU 分解)"""
    times = []
    
    for _ in range(iterations):
        A = np.random.rand(n, n)
        
        start = time.perf_counter()
        from scipy import linalg
        linalg.lu(A)
        elapsed = time.perf_counter() - start
        times.append(elapsed)
    
    return {
        "size": f"{n}x{n}",
        "avg_time_ms": np.mean(times) * 1000
    }


def benchmark_vector_operations(n: int, iterations: int = 10) -> dict:
    """测试向量运算性能"""
    times_dot = []
    times_norm = []
    
    for _ in range(iterations):
        a = np.random.rand(n)
        b = np.random.rand(n)
        
        start = time.perf_counter()
        np.dot(a, b)
        times_dot.append(time.perf_counter() - start)
        
        start = time.perf_counter()
        np.linalg.norm(a)
        times_norm.append(time.perf_counter() - start)
    
    return {
        "size": n,
        "dot_avg_ms": np.mean(times_dot) * 1000,
        "norm_avg_ms": np.mean(times_norm) * 1000
    }


def run_benchmark():
    """运行完整基准测试"""
    print("=" * 60)
    print("CPU Matrix Operations Benchmark")
    print(f"NumPy version: {np.__version__}")
    print(f"NumPy BLAS: {np.show_config}")
    print("=" * 60)
    
    # 矩阵乘法测试
    print("\n[Matrix Multiplication]")
    print(f"{'Size':<15} {'Time (ms)':<15} {'GFLOPS':<15}")
    print("-" * 45)
    
    for n in [256, 512, 1024, 2048]:
        result = benchmark_matrix_multiply(n)
        print(f"{result['size']:<15} {result['avg_time_ms']:<15.2f} {result['flops_gflops']:<15.2f}")
    
    # 向量运算测试
    print("\n[Vector Operations]")
    print(f"{'Size':<15} {'Dot (ms)':<15} {'Norm (ms)':<15}")
    print("-" * 45)
    
    for n in [10_000, 100_000, 1_000_000]:
        result = benchmark_vector_operations(n)
        print(f"{result['size']:<15} {result['dot_avg_ms']:<15.4f} {result['norm_avg_ms']:<15.4f}")
    
    # LU 分解测试 (需要 scipy)
    try:
        from scipy import linalg
        print("\n[LU Decomposition]")
        print(f"{'Size':<15} {'Time (ms)':<15}")
        print("-" * 30)
        
        for n in [256, 512, 1024]:
            result = benchmark_matrix_decomposition(n)
            print(f"{result['size']:<15} {result['avg_time_ms']:<15.2f}")
    except ImportError:
        print("\n[LU Decomposition] Skipped (scipy not installed)")
    
    print("\n" + "=" * 60)
    print("Benchmark complete!")


if __name__ == "__main__":
    run_benchmark()
