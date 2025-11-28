#!/usr/bin/env python3
"""
AgriVerse 前后端连通性测试脚本 (Python版本)
使用虚拟测试方法测试所有API端点和连通性
"""

import requests
import json
import time
import random
import sys
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin

# 配置
CONFIG = {
    'backend_url': os.getenv('BACKEND_URL', 'http://localhost:8080'),
    'frontend_url': os.getenv('FRONTEND_URL', 'http://localhost:5173'),
    'timeout': 10,
    'verbose': '-v' in sys.argv or '--verbose' in sys.argv
}

# 测试结果统计
test_results = {
    'total': 0,
    'passed': 0,
    'failed': 0,
    'results': []
}

# 颜色输出
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    GRAY = '\033[90m'
    RESET = '\033[0m'

def log(message: str, color: str = Colors.RESET):
    """输出带颜色的日志"""
    print(f"{color}{message}{Colors.RESET}")

def record_test(name: str, passed: bool, message: str = '', 
                status_code: int = 0, response_time: str = ''):
    """记录测试结果"""
    test_results['total'] += 1
    if passed:
        test_results['passed'] += 1
        log(f"  ✓ {name}", Colors.GREEN)
        if CONFIG['verbose'] and message:
            log(f"    {message}", Colors.GRAY)
    else:
        test_results['failed'] += 1
        log(f"  ✗ {name}", Colors.RED)
        if message:
            log(f"    {message}", Colors.RED)
    
    test_results['results'].append({
        'name': name,
        'passed': passed,
        'message': message,
        'status_code': status_code,
        'response_time': response_time
    })

def test_api_endpoint(name: str, url: str, method: str = 'GET',
                     headers: Optional[Dict] = None, body: Optional[Dict] = None,
                     expected_status_codes: List[int] = [200, 401, 403]) -> Dict:
    """测试API端点"""
    try:
        start_time = time.time()
        
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=CONFIG['timeout'])
        elif method == 'POST':
            response = requests.post(url, json=body, headers=headers, timeout=CONFIG['timeout'])
        elif method == 'PUT':
            response = requests.put(url, json=body, headers=headers, timeout=CONFIG['timeout'])
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=CONFIG['timeout'])
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response_time = f"{(time.time() - start_time) * 1000:.0f}ms"
        passed = response.status_code in expected_status_codes
        message = f"Status: {response.status_code}, Time: {response_time}"
        
        record_test(name, passed, message, response.status_code, response_time)
        
        return {
            'success': passed,
            'status_code': response.status_code,
            'response_time': response_time,
            'content': response.text
        }
    except requests.exceptions.RequestException as e:
        status_code = 0
        if hasattr(e, 'response') and e.response is not None:
            status_code = e.response.status_code
        
        passed = status_code in expected_status_codes if status_code > 0 else False
        message = f"Error: {str(e)} (Status: {status_code})"
        
        record_test(name, passed, message, status_code)
        
        return {
            'success': passed,
            'status_code': status_code,
            'response_time': 'N/A',
            'content': ''
        }

def get_virtual_test_data() -> Dict:
    """生成虚拟测试数据"""
    random_id = random.randint(10000000, 99999999)
    return {
        'virtual_user': {
            'phone': f'138{random_id:08d}',
            'password': 'VirtualTest@123456',
            'email': 'virtual.test@example.com',
            'name': '虚拟测试用户',
            'role': 'farmer'
        },
        'virtual_product': {
            'name': f'虚拟测试商品_{random.randint(1000, 9999)}',
            'description': '这是一个虚拟测试商品',
            'category': '蔬菜',
            'price': random.randint(10, 100),
            'stock': random.randint(50, 500),
            'unit': '斤',
            'origin': '虚拟产地'
        },
        'virtual_order': {
            'items': [{
                'productId': 'virtual-product-id',
                'quantity': 2,
                'price': 10.50
            }],
            'addressId': 'virtual-address-id',
            'remark': '虚拟测试订单'
        },
        'virtual_finance': {
            'amount': 50000,
            'termMonths': 12,
            'purpose': '虚拟测试融资用途',
            'productId': 'virtual-loan-product-id'
        }
    }

def main():
    """主测试函数"""
    log('\n========================================', Colors.CYAN)
    log('AgriVerse 前后端连通性测试', Colors.CYAN)
    log('========================================', Colors.CYAN)
    log('')
    log(f"后端地址: {CONFIG['backend_url']}", Colors.CYAN)
    log(f"前端地址: {CONFIG['frontend_url']}", Colors.CYAN)
    log('')
    
    # 1. 测试服务可用性
    log('========================================', Colors.YELLOW)
    log('1. 服务可用性测试', Colors.YELLOW)
    log('========================================', Colors.YELLOW)
    log('')
    
    log('测试后端服务...', Colors.CYAN)
    backend_test = test_api_endpoint(
        '后端服务健康检查',
        f"{CONFIG['backend_url']}/api/auth/health",
        expected_status_codes=[200]
    )
    
    if not backend_test['success']:
        log('后端服务不可用，请确保后端服务正在运行', Colors.RED)
        log('启动命令: cd ../backend && mvn spring-boot:run', Colors.YELLOW)
        sys.exit(1)
    
    log('测试前端服务...', Colors.CYAN)
    try:
        response = requests.get(CONFIG['frontend_url'], timeout=5)
        record_test('前端服务健康检查', response.status_code == 200,
                   f"Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        log('前端服务不可用，但可以继续测试API', Colors.YELLOW)
        record_test('前端服务健康检查', False, f"Error: {str(e)}")
    
    log('')
    
    # 2. 测试认证API
    log('========================================', Colors.YELLOW)
    log('2. 认证API测试', Colors.YELLOW)
    log('========================================', Colors.YELLOW)
    log('')
    
    test_data = get_virtual_test_data()
    
    test_api_endpoint('认证服务健康检查',
                     f"{CONFIG['backend_url']}/api/auth/health",
                     expected_status_codes=[200])
    
    test_api_endpoint('发送验证码API',
                     f"{CONFIG['backend_url']}/api/auth/send-code",
                     method='POST',
                     body={
                         'phone': test_data['virtual_user']['phone'],
                         'type': 'register',
                         'role': 'farmer'
                     },
                     expected_status_codes=[200, 400, 429])
    
    test_api_endpoint('检查手机号API',
                     f"{CONFIG['backend_url']}/api/auth/check-phone?phone={test_data['virtual_user']['phone']}&role=farmer",
                     expected_status_codes=[200])
    
    login_result = test_api_endpoint('用户登录API',
                                    f"{CONFIG['backend_url']}/api/auth/login",
                                    method='POST',
                                    body={
                                        'phone': test_data['virtual_user']['phone'],
                                        'password': test_data['virtual_user']['password'],
                                        'role': 'farmer'
                                    },
                                    expected_status_codes=[200, 401])
    
    # 提取token
    token = None
    if login_result['success'] and login_result['status_code'] == 200:
        try:
            login_data = json.loads(login_result['content'])
            if 'data' in login_data and 'token' in login_data['data']:
                token = login_data['data']['token']
                log(f"  获取到Token: {token[:20]}...", Colors.GREEN)
        except (json.JSONDecodeError, KeyError):
            pass
    
    log('')
    
    # 3. 测试农户API
    log('========================================', Colors.YELLOW)
    log('3. 农户API测试', Colors.YELLOW)
    log('========================================', Colors.YELLOW)
    log('')
    
    farmer_headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    test_api_endpoint('农户商品服务健康检查',
                     f"{CONFIG['backend_url']}/api/farmer/products/health",
                     headers=farmer_headers,
                     expected_status_codes=[200])
    
    test_api_endpoint('获取商品列表API',
                     f"{CONFIG['backend_url']}/api/farmer/products/list?page=1&pageSize=20",
                     headers=farmer_headers,
                     expected_status_codes=[200, 401])
    
    test_api_endpoint('创建商品API',
                     f"{CONFIG['backend_url']}/api/farmer/products/create",
                     method='POST',
                     headers=farmer_headers,
                     body=test_data['virtual_product'],
                     expected_status_codes=[200, 400, 401])
    
    test_api_endpoint('获取商品数据看板API',
                     f"{CONFIG['backend_url']}/api/farmer/products/dashboard",
                     headers=farmer_headers,
                     expected_status_codes=[200, 401])
    
    log('')
    
    # 4. 测试买家API
    log('========================================', Colors.YELLOW)
    log('4. 买家API测试', Colors.YELLOW)
    log('========================================', Colors.YELLOW)
    log('')
    
    test_api_endpoint('买家商品服务健康检查',
                     f"{CONFIG['backend_url']}/api/buyer/products/health",
                     headers=farmer_headers,
                     expected_status_codes=[200])
    
    test_api_endpoint('买家获取商品列表API',
                     f"{CONFIG['backend_url']}/api/buyer/products/list?page=1&pageSize=20",
                     headers=farmer_headers,
                     expected_status_codes=[200, 401])
    
    test_api_endpoint('获取购物车API',
                     f"{CONFIG['backend_url']}/api/buyer/cart",
                     headers=farmer_headers,
                     expected_status_codes=[200, 401])
    
    log('')
    
    # 5. 测试银行API
    log('========================================', Colors.YELLOW)
    log('5. 银行API测试', Colors.YELLOW)
    log('========================================', Colors.YELLOW)
    log('')
    
    test_api_endpoint('获取贷款产品列表API',
                     f"{CONFIG['backend_url']}/api/bank/loan/products?page=1&pageSize=20",
                     headers=farmer_headers,
                     expected_status_codes=[200, 401, 403])
    
    log('')
    
    # 输出测试总结
    log('========================================', Colors.CYAN)
    log('测试总结', Colors.CYAN)
    log('========================================', Colors.CYAN)
    log('')
    log(f"总测试数: {test_results['total']}")
    log(f"通过: {test_results['passed']}", Colors.GREEN)
    log(f"失败: {test_results['failed']}", Colors.RED)
    
    pass_rate = (test_results['passed'] / test_results['total'] * 100) if test_results['total'] > 0 else 0
    pass_rate_color = Colors.GREEN if pass_rate >= 80 else Colors.YELLOW if pass_rate >= 60 else Colors.RED
    log(f"通过率: {pass_rate:.2f}%", pass_rate_color)
    log('')
    
    # 生成测试报告
    report_dir = 'test-results'
    os.makedirs(report_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    report_path = os.path.join(report_dir, f'connectivity-report-{timestamp}.json')
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'backend_url': CONFIG['backend_url'],
        'frontend_url': CONFIG['frontend_url'],
        'summary': {
            'total': test_results['total'],
            'passed': test_results['passed'],
            'failed': test_results['failed'],
            'pass_rate': round(pass_rate, 2)
        },
        'results': test_results['results']
    }
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    log(f"测试报告已保存: {report_path}", Colors.CYAN)
    log('')
    
    # 返回退出码
    sys.exit(0 if test_results['failed'] == 0 else 1)

if __name__ == '__main__':
    main()

