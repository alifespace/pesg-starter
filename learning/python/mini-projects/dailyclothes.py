import random

# 第一组：12个数字选5个（不重复，等概率）
nums1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

group1 = random.sample(nums1, 5)


# 第二组：7个数字选2个（不重复，等概率）
nums2 = [1, 2, 3, 4, 5, 6, 7]

group2 = random.sample(nums2, 2)


print("第一组:", group1)
print("第二组:", group2)

import sys
print(sys.executable)
print(sys.prefix)