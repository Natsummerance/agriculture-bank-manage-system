/**
 * AgriVerse 前后端连通性测试脚本 (Node.js版本)
 * 使用虚拟测试方法测试所有API端点和连通性
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// 配置
const config = {
  backendUrl: process.env.BACKEND_URL || 'http://localhost:8080',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  timeout: 10000,
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
};

// 测试结果统计
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  results: []
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 记录测试结果
function recordTest(name, passed, message = '', statusCode = 0, responseTime = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`  ✓ ${name}`, 'green');
    if (config.verbose && message) {
      log(`    ${message}`, 'gray');
    }
  } else {
    testResults.failed++;
    log(`  ✗ ${name}`, 'red');
    if (message) {
      log(`    ${message}`, 'red');
    }
  }
  
  testResults.results.push({
    name,
    passed,
    message,
    statusCode,
    responseTime
  });
}

// HTTP请求函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: config.timeout
    };
    
    if (options.body) {
      const bodyString = JSON.stringify(options.body);
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }
    
    const startTime = Date.now();
    const req = httpModule.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = `${Date.now() - startTime}ms`;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// 测试API端点
async function testApiEndpoint(name, url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    expectedStatusCodes = [200, 401, 403]
  } = options;
  
  try {
    const response = await makeRequest(url, { method, headers, body });
    const passed = expectedStatusCodes.includes(response.statusCode);
    const message = `Status: ${response.statusCode}, Time: ${response.responseTime}`;
    
    recordTest(name, passed, message, response.statusCode, response.responseTime);
    
    return {
      success: passed,
      statusCode: response.statusCode,
      responseTime: response.responseTime,
      content: response.body
    };
  } catch (error) {
    const message = `Error: ${error.message}`;
    recordTest(name, false, message, 0);
    
    return {
      success: false,
      statusCode: 0,
      responseTime: 'N/A',
      content: ''
    };
  }
}

// 生成虚拟测试数据
function getVirtualTestData() {
  const randomId = Math.floor(Math.random() * 100000000);
  return {
    virtualUser: {
      phone: `138${String(randomId).padStart(8, '0')}`,
      password: 'VirtualTest@123456',
      email: 'virtual.test@example.com',
      name: '虚拟测试用户',
      role: 'farmer'
    },
    virtualProduct: {
      name: `虚拟测试商品_${Math.floor(Math.random() * 9000) + 1000}`,
      description: '这是一个虚拟测试商品',
      category: '蔬菜',
      price: Math.floor(Math.random() * 90) + 10,
      stock: Math.floor(Math.random() * 450) + 50,
      unit: '斤',
      origin: '虚拟产地'
    },
    virtualOrder: {
      items: [{
        productId: 'virtual-product-id',
        quantity: 2,
        price: 10.50
      }],
      addressId: 'virtual-address-id',
      remark: '虚拟测试订单'
    },
    virtualFinance: {
      amount: 50000,
      termMonths: 12,
      purpose: '虚拟测试融资用途',
      productId: 'virtual-loan-product-id'
    }
  };
}

// 主测试函数
async function runTests() {
  log('\n========================================', 'cyan');
  log('AgriVerse 前后端连通性测试', 'cyan');
  log('========================================', 'cyan');
  log('');
  log(`后端地址: ${config.backendUrl}`, 'cyan');
  log(`前端地址: ${config.frontendUrl}`, 'cyan');
  log('');
  
  // 1. 测试服务可用性
  log('========================================', 'yellow');
  log('1. 服务可用性测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  log('测试后端服务...', 'cyan');
  const backendTest = await testApiEndpoint(
    '后端服务健康检查',
    `${config.backendUrl}/api/auth/health`,
    { expectedStatusCodes: [200] }
  );
  
  if (!backendTest.success) {
    log('后端服务不可用，请确保后端服务正在运行', 'red');
    log('启动命令: cd ../backend && mvn spring-boot:run', 'yellow');
    process.exit(1);
  }
  
  log('测试前端服务...', 'cyan');
  try {
    const frontendResponse = await makeRequest(config.frontendUrl);
    recordTest('前端服务健康检查', frontendResponse.statusCode === 200, 
      `Status: ${frontendResponse.statusCode}`);
  } catch (error) {
    log('前端服务不可用，但可以继续测试API', 'yellow');
    recordTest('前端服务健康检查', false, `Error: ${error.message}`);
  }
  
  log('');
  
  // 2. 测试认证API
  log('========================================', 'yellow');
  log('2. 认证API测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  const testData = getVirtualTestData();
  
  await testApiEndpoint('认证服务健康检查', `${config.backendUrl}/api/auth/health`, 
    { expectedStatusCodes: [200] });
  
  await testApiEndpoint('发送验证码API', `${config.backendUrl}/api/auth/send-code`, {
    method: 'POST',
    body: {
      phone: testData.virtualUser.phone,
      type: 'register',
      role: 'farmer'
    },
    expectedStatusCodes: [200, 400, 429]
  });
  
  await testApiEndpoint('检查手机号API', 
    `${config.backendUrl}/api/auth/check-phone?phone=${testData.virtualUser.phone}&role=farmer`,
    { expectedStatusCodes: [200] });
  
  const loginResult = await testApiEndpoint('用户登录API', `${config.backendUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      phone: testData.virtualUser.phone,
      password: testData.virtualUser.password,
      role: 'farmer'
    },
    expectedStatusCodes: [200, 401]
  });
  
  // 提取token
  let token = null;
  if (loginResult.success && loginResult.statusCode === 200) {
    try {
      const loginData = JSON.parse(loginResult.content);
      if (loginData.data && loginData.data.token) {
        token = loginData.data.token;
        log(`  获取到Token: ${token.substring(0, Math.min(20, token.length))}...`, 'green');
      }
    } catch (e) {
      // Token提取失败，继续测试
    }
  }
  
  log('');
  
  // 3. 测试农户API
  log('========================================', 'yellow');
  log('3. 农户API测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  const farmerHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  await testApiEndpoint('农户商品服务健康检查', 
    `${config.backendUrl}/api/farmer/products/health`,
    { headers: farmerHeaders, expectedStatusCodes: [200] });
  
  await testApiEndpoint('获取商品列表API',
    `${config.backendUrl}/api/farmer/products/list?page=1&pageSize=20`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401] });
  
  await testApiEndpoint('创建商品API', `${config.backendUrl}/api/farmer/products/create`, {
    method: 'POST',
    headers: farmerHeaders,
    body: testData.virtualProduct,
    expectedStatusCodes: [200, 400, 401]
  });
  
  await testApiEndpoint('获取商品数据看板API',
    `${config.backendUrl}/api/farmer/products/dashboard`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401] });
  
  log('');
  
  // 4. 测试买家API
  log('========================================', 'yellow');
  log('4. 买家API测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  await testApiEndpoint('买家商品服务健康检查',
    `${config.backendUrl}/api/buyer/products/health`,
    { headers: farmerHeaders, expectedStatusCodes: [200] });
  
  await testApiEndpoint('买家获取商品列表API',
    `${config.backendUrl}/api/buyer/products/list?page=1&pageSize=20`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401] });
  
  await testApiEndpoint('获取购物车API', `${config.backendUrl}/api/buyer/cart`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401] });
  
  await testApiEndpoint('获取订单列表API',
    `${config.backendUrl}/api/buyer/orders?page=1&pageSize=20`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401] });
  
  log('');
  
  // 5. 测试银行API
  log('========================================', 'yellow');
  log('5. 银行API测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  await testApiEndpoint('获取贷款产品列表API',
    `${config.backendUrl}/api/bank/loan/products?page=1&pageSize=20`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401, 403] });
  
  await testApiEndpoint('获取贷款申请列表API',
    `${config.backendUrl}/api/bank/loan/applications?page=1&pageSize=20`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401, 403] });
  
  log('');
  
  // 6. 测试专家API
  log('========================================', 'yellow');
  log('6. 专家API测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  await testApiEndpoint('搜索问题API', `${config.backendUrl}/api/expert/qa/questions/search`, {
    method: 'POST',
    headers: farmerHeaders,
    body: {
      keyword: '测试',
      status: 'pending',
      page: 1,
      pageSize: 20
    },
    expectedStatusCodes: [200, 401, 403]
  });
  
  log('');
  
  // 7. 测试管理员API
  log('========================================', 'yellow');
  log('7. 管理员API测试', 'yellow');
  log('========================================', 'yellow');
  log('');
  
  await testApiEndpoint('获取用户列表API',
    `${config.backendUrl}/api/admin/users?page=1&pageSize=20`,
    { headers: farmerHeaders, expectedStatusCodes: [200, 401, 403] });
  
  log('');
  
  // 输出测试总结
  log('========================================', 'cyan');
  log('测试总结', 'cyan');
  log('========================================', 'cyan');
  log('');
  log(`总测试数: ${testResults.total}`, 'reset');
  log(`通过: ${testResults.passed}`, 'green');
  log(`失败: ${testResults.failed}`, 'red');
  
  const passRate = testResults.total > 0 
    ? ((testResults.passed / testResults.total) * 100).toFixed(2) 
    : 0;
  
  const passRateColor = passRate >= 80 ? 'green' : passRate >= 60 ? 'yellow' : 'red';
  log(`通过率: ${passRate}%`, passRateColor);
  log('');
  
  // 输出失败测试详情
  if (testResults.failed > 0) {
    log('失败的测试:', 'red');
    testResults.results
      .filter(r => !r.passed)
      .forEach(r => {
        log(`  ✗ ${r.name}`, 'red');
        if (r.message) {
          log(`    ${r.message}`, 'gray');
        }
      });
    log('');
  }
  
  // 生成测试报告
  const fs = require('fs');
  const path = require('path');
  const reportDir = path.join(__dirname, '..', 'test-results');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `connectivity-report-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    backendUrl: config.backendUrl,
    frontendUrl: config.frontendUrl,
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      passRate: parseFloat(passRate)
    },
    results: testResults.results
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  log(`测试报告已保存: ${reportPath}`, 'cyan');
  log('');
  
  // 返回退出码
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// 运行测试
runTests().catch(error => {
  log(`测试执行出错: ${error.message}`, 'red');
  process.exit(1);
});

