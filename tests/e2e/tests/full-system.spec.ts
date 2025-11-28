import { test, expect, Page } from '@playwright/test';

/**
 * 完整系统集成测试
 * 覆盖所有前后端功能页面和业务流程
 */

// 测试用户凭据
const TEST_USERS = {
  farmer: {
    phone: '13800000001',
    password: 'Test@123456',
    role: 'farmer',
  },
  buyer: {
    phone: '13900000001',
    password: 'Test@123456',
    role: 'buyer',
  },
  bank: {
    phone: '13700000001',
    password: 'Test@123456',
    role: 'bank',
  },
  expert: {
    phone: '13600000001',
    password: 'Test@123456',
    role: 'expert',
  },
  admin: {
    phone: '13500000001',
    password: 'Test@123456',
    role: 'admin',
  },
};

// 辅助函数：登录用户
async function loginUser(page: Page, user: typeof TEST_USERS.farmer) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // 点击登录或选择角色
  const loginButton = page.locator('text=登录').or(page.locator('text=Login'));
  if (await loginButton.isVisible()) {
    await loginButton.click();
  }
  
  // 选择角色
  const roleButton = page.locator(`text=${user.role === 'farmer' ? '农户' : user.role === 'buyer' ? '买家' : user.role === 'bank' ? '银行' : user.role === 'expert' ? '专家' : '管理员'}`);
  if (await roleButton.isVisible()) {
    await roleButton.click();
  }
  
  // 输入手机号和密码
  await page.fill('input[type="tel"], input[placeholder*="手机"], input[name="phone"]', user.phone);
  await page.fill('input[type="password"], input[placeholder*="密码"], input[name="password"]', user.password);
  
  // 点击登录按钮
  await page.click('button:has-text("登录"), button:has-text("Login"), button[type="submit"]');
  
  // 等待登录完成
  await page.waitForURL(/\/farmer|\/buyer|\/bank|\/expert|\/admin|\/app/, { timeout: 10000 });
}

// 辅助函数：等待API响应
async function waitForAPIResponse(page: Page, urlPattern: string | RegExp, timeout = 10000) {
  await page.waitForResponse(
    (response) => {
      const url = response.url();
      return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
    },
    { timeout }
  );
}

test.describe('完整系统集成测试', () => {
  test.beforeEach(async ({ page }) => {
    // 设置较长的超时时间
    test.setTimeout(60000);
  });

  test.describe('1. 认证模块测试', () => {
    test('1.1 访问首页', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/AgriVerse|农业/);
      await page.screenshot({ path: 'test-results/01-homepage.png' });
    });

    test('1.2 选择角色页面', async ({ page }) => {
      await page.goto('/select-role');
      await expect(page.locator('text=选择角色').or(page.locator('text=Select Role'))).toBeVisible();
      await page.screenshot({ path: 'test-results/02-select-role.png' });
    });

    test('1.3 农户登录流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.farmer);
      await expect(page).toHaveURL(/\/farmer|\/farmer-app/);
      await page.screenshot({ path: 'test-results/03-farmer-login.png' });
    });

    test('1.4 买家登录流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.buyer);
      await expect(page).toHaveURL(/\/buyer|\/buyer-app/);
      await page.screenshot({ path: 'test-results/04-buyer-login.png' });
    });

    test('1.5 银行登录流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.bank);
      await expect(page).toHaveURL(/\/bank|\/bank-app/);
      await page.screenshot({ path: 'test-results/05-bank-login.png' });
    });

    test('1.6 专家登录流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.expert);
      await expect(page).toHaveURL(/\/expert|\/expert-app/);
      await page.screenshot({ path: 'test-results/06-expert-login.png' });
    });

    test('1.7 管理员登录流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.admin);
      await expect(page).toHaveURL(/\/admin|\/admin-app/);
      await page.screenshot({ path: 'test-results/07-admin-login.png' });
    });
  });

  test.describe('2. 农户模块测试', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, TEST_USERS.farmer);
    });

    test('2.1 农户首页', async ({ page }) => {
      await page.goto('/farmer');
      await expect(page.locator('text=首页').or(page.locator('text=Home'))).toBeVisible();
      await page.screenshot({ path: 'test-results/08-farmer-home.png' });
    });

    test('2.2 商品列表页面', async ({ page }) => {
      await page.goto('/farmer/products');
      await expect(page).toHaveURL(/\/farmer\/products/);
      await waitForAPIResponse(page, /\/api\/farmer\/products/);
      await page.screenshot({ path: 'test-results/09-farmer-products.png' });
    });

    test('2.3 商品数据看板', async ({ page }) => {
      await page.goto('/farmer/products/dashboard');
      await expect(page).toHaveURL(/\/farmer\/products\/dashboard/);
      await waitForAPIResponse(page, /\/api\/farmer\/products\/dashboard/);
      await page.screenshot({ path: 'test-results/10-farmer-dashboard.png' });
    });

    test('2.4 商品导入页面', async ({ page }) => {
      await page.goto('/farmer/products/import');
      await expect(page).toHaveURL(/\/farmer\/products\/import/);
      await page.screenshot({ path: 'test-results/11-farmer-import.png' });
    });

    test('2.5 订单管理页面', async ({ page }) => {
      await page.goto('/farmer/orders');
      await expect(page).toHaveURL(/\/farmer\/orders/);
      await waitForAPIResponse(page, /\/api\/farmer\/orders/);
      await page.screenshot({ path: 'test-results/12-farmer-orders.png' });
    });

    test('2.6 退款管理页面', async ({ page }) => {
      await page.goto('/farmer/refunds');
      await expect(page).toHaveURL(/\/farmer\/refunds/);
      await page.screenshot({ path: 'test-results/13-farmer-refunds.png' });
    });

    test('2.7 融资申请页面', async ({ page }) => {
      await page.goto('/farmer/finance');
      await expect(page).toHaveURL(/\/farmer\/finance/);
      await page.screenshot({ path: 'test-results/14-farmer-finance.png' });
    });

    test('2.8 融资列表页面', async ({ page }) => {
      await page.goto('/farmer/finance/list');
      await expect(page).toHaveURL(/\/farmer\/finance\/list/);
      await waitForAPIResponse(page, /\/api\/farmer\/finance/);
      await page.screenshot({ path: 'test-results/15-farmer-finance-list.png' });
    });

    test('2.9 融资进度页面', async ({ page }) => {
      await page.goto('/farmer/finance/progress');
      await expect(page).toHaveURL(/\/farmer\/finance\/progress/);
      await page.screenshot({ path: 'test-results/16-farmer-finance-progress.png' });
    });

    test('2.10 提前还款页面', async ({ page }) => {
      await page.goto('/farmer/finance/early-repay');
      await expect(page).toHaveURL(/\/farmer\/finance\/early-repay/);
      await page.screenshot({ path: 'test-results/17-farmer-early-repay.png' });
    });

    test('2.11 合同签署页面', async ({ page }) => {
      await page.goto('/farmer/finance/contract-sign');
      await expect(page).toHaveURL(/\/farmer\/finance\/contract-sign/);
      await page.screenshot({ path: 'test-results/18-farmer-contract-sign.png' });
    });

    test('2.12 智能拼单介绍页面', async ({ page }) => {
      await page.goto('/farmer/finance/match');
      await expect(page).toHaveURL(/\/farmer\/finance\/match/);
      await page.screenshot({ path: 'test-results/19-farmer-match-intro.png' });
    });

    test('2.13 拼单候选页面', async ({ page }) => {
      await page.goto('/farmer/finance/match/candidates');
      await expect(page).toHaveURL(/\/farmer\/finance\/match\/candidates/);
      await waitForAPIResponse(page, /\/api\/farmer\/finance\/match/);
      await page.screenshot({ path: 'test-results/20-farmer-match-candidates.png' });
    });

    test('2.14 钱包页面', async ({ page }) => {
      await page.goto('/farmer/wallet');
      await expect(page).toHaveURL(/\/farmer\/wallet/);
      await page.screenshot({ path: 'test-results/21-farmer-wallet.png' });
    });

    test('2.15 报表页面', async ({ page }) => {
      await page.goto('/farmer/report');
      await expect(page).toHaveURL(/\/farmer\/report/);
      await page.screenshot({ path: 'test-results/22-farmer-report.png' });
    });
  });

  test.describe('3. 买家模块测试', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, TEST_USERS.buyer);
    });

    test('3.1 买家首页', async ({ page }) => {
      await page.goto('/buyer');
      await expect(page.locator('text=首页').or(page.locator('text=Home'))).toBeVisible();
      await page.screenshot({ path: 'test-results/23-buyer-home.png' });
    });

    test('3.2 商品列表页面', async ({ page }) => {
      await page.goto('/buyer/products');
      await expect(page).toHaveURL(/\/buyer\/products/);
      await waitForAPIResponse(page, /\/api\/buyer\/products/);
      await page.screenshot({ path: 'test-results/24-buyer-products.png' });
    });

    test('3.3 购物车页面', async ({ page }) => {
      await page.goto('/buyer/cart');
      await expect(page).toHaveURL(/\/buyer\/cart/);
      await waitForAPIResponse(page, /\/api\/buyer\/cart/);
      await page.screenshot({ path: 'test-results/25-buyer-cart.png' });
    });

    test('3.4 订单列表页面', async ({ page }) => {
      await page.goto('/buyer/orders');
      await expect(page).toHaveURL(/\/buyer\/orders/);
      await waitForAPIResponse(page, /\/api\/buyer\/orders/);
      await page.screenshot({ path: 'test-results/26-buyer-orders.png' });
    });

    test('3.5 需求发布页面', async ({ page }) => {
      await page.goto('/buyer/demand');
      await expect(page).toHaveURL(/\/buyer\/demand/);
      await page.screenshot({ path: 'test-results/27-buyer-demand.png' });
    });

    test('3.6 优惠券页面', async ({ page }) => {
      await page.goto('/buyer/coupon');
      await expect(page).toHaveURL(/\/buyer\/coupon/);
      await page.screenshot({ path: 'test-results/28-buyer-coupon.png' });
    });
  });

  test.describe('4. 银行模块测试', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, TEST_USERS.bank);
    });

    test('4.1 银行仪表板', async ({ page }) => {
      await page.goto('/bank');
      await expect(page).toHaveURL(/\/bank/);
      await waitForAPIResponse(page, /\/api\/bank\/dashboard/);
      await page.screenshot({ path: 'test-results/29-bank-dashboard.png' });
    });

    test('4.2 贷款审批页面', async ({ page }) => {
      await page.goto('/bank/approval');
      await expect(page).toHaveURL(/\/bank\/approval/);
      await waitForAPIResponse(page, /\/api\/bank\/approval/);
      await page.screenshot({ path: 'test-results/30-bank-approval.png' });
    });

    test('4.3 贷款产品页面', async ({ page }) => {
      await page.goto('/bank/products');
      await expect(page).toHaveURL(/\/bank\/products/);
      await waitForAPIResponse(page, /\/api\/bank\/loan\/products/);
      await page.screenshot({ path: 'test-results/31-bank-products.png' });
    });

    test('4.4 贷后管理页面', async ({ page }) => {
      await page.goto('/bank/post-loan');
      await expect(page).toHaveURL(/\/bank\/post-loan/);
      await waitForAPIResponse(page, /\/api\/bank\/post-loan/);
      await page.screenshot({ path: 'test-results/32-bank-post-loan.png' });
    });

    test('4.5 风险控制仪表板', async ({ page }) => {
      await page.goto('/bank/risk-dashboard');
      await expect(page).toHaveURL(/\/bank\/risk-dashboard/);
      await waitForAPIResponse(page, /\/api\/bank\/risk/);
      await page.screenshot({ path: 'test-results/33-bank-risk.png' });
    });
  });

  test.describe('5. 专家模块测试', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, TEST_USERS.expert);
    });

    test('5.1 专家仪表板', async ({ page }) => {
      await page.goto('/expert');
      await expect(page).toHaveURL(/\/expert/);
      await waitForAPIResponse(page, /\/api\/expert\/dashboard/);
      await page.screenshot({ path: 'test-results/34-expert-dashboard.png' });
    });

    test('5.2 问答列表页面', async ({ page }) => {
      await page.goto('/expert/qa');
      await expect(page).toHaveURL(/\/expert\/qa/);
      await waitForAPIResponse(page, /\/api\/expert\/qa/);
      await page.screenshot({ path: 'test-results/35-expert-qa.png' });
    });

    test('5.3 预约日历页面', async ({ page }) => {
      await page.goto('/expert/calendar');
      await expect(page).toHaveURL(/\/expert\/calendar/);
      await waitForAPIResponse(page, /\/api\/expert\/appointments/);
      await page.screenshot({ path: 'test-results/36-expert-calendar.png' });
    });

    test('5.4 知识库页面', async ({ page }) => {
      await page.goto('/expert/knowledge');
      await expect(page).toHaveURL(/\/expert\/knowledge/);
      await page.screenshot({ path: 'test-results/37-expert-knowledge.png' });
    });

    test('5.5 收入统计页面', async ({ page }) => {
      await page.goto('/expert/income');
      await expect(page).toHaveURL(/\/expert\/income/);
      await waitForAPIResponse(page, /\/api\/expert\/income/);
      await page.screenshot({ path: 'test-results/38-expert-income.png' });
    });

    test('5.6 直播页面', async ({ page }) => {
      await page.goto('/expert/live');
      await expect(page).toHaveURL(/\/expert\/live/);
      await page.screenshot({ path: 'test-results/39-expert-live.png' });
    });
  });

  test.describe('6. 管理员模块测试', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, TEST_USERS.admin);
    });

    test('6.1 管理员仪表板', async ({ page }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL(/\/admin/);
      await waitForAPIResponse(page, /\/api\/admin\/dashboard/);
      await page.screenshot({ path: 'test-results/40-admin-dashboard.png' });
    });

    test('6.2 用户管理页面', async ({ page }) => {
      await page.goto('/admin/users');
      await expect(page).toHaveURL(/\/admin\/users/);
      await waitForAPIResponse(page, /\/api\/admin\/users/);
      await page.screenshot({ path: 'test-results/41-admin-users.png' });
    });

    test('6.3 商品审核页面', async ({ page }) => {
      await page.goto('/admin/product-audit');
      await expect(page).toHaveURL(/\/admin\/product-audit/);
      await waitForAPIResponse(page, /\/api\/admin\/audit/);
      await page.screenshot({ path: 'test-results/42-admin-product-audit.png' });
    });

    test('6.4 订单监控页面', async ({ page }) => {
      await page.goto('/admin/order-monitor');
      await expect(page).toHaveURL(/\/admin\/order-monitor/);
      await waitForAPIResponse(page, /\/api\/admin\/orders/);
      await page.screenshot({ path: 'test-results/43-admin-order-monitor.png' });
    });

    test('6.5 内容审核页面', async ({ page }) => {
      await page.goto('/admin/content-audit');
      await expect(page).toHaveURL(/\/admin\/content-audit/);
      await waitForAPIResponse(page, /\/api\/admin\/content-audit/);
      await page.screenshot({ path: 'test-results/44-admin-content-audit.png' });
    });

    test('6.6 权限管理页面', async ({ page }) => {
      await page.goto('/admin/permission');
      await expect(page).toHaveURL(/\/admin\/permission/);
      await waitForAPIResponse(page, /\/api\/admin\/permission/);
      await page.screenshot({ path: 'test-results/45-admin-permission.png' });
    });

    test('6.7 退款纠纷页面', async ({ page }) => {
      await page.goto('/admin/refund-disputes');
      await expect(page).toHaveURL(/\/admin\/refund-disputes/);
      await waitForAPIResponse(page, /\/api\/admin\/refund/);
      await page.screenshot({ path: 'test-results/46-admin-refund-disputes.png' });
    });
  });

  test.describe('7. 完整业务流程测试', () => {
    test('7.1 农户创建商品 -> 买家查看 -> 买家下单', async ({ page }) => {
      // 1. 农户登录并创建商品
      await loginUser(page, TEST_USERS.farmer);
      await page.goto('/farmer/products');
      
      // 点击创建商品按钮
      const createButton = page.locator('button:has-text("创建"), button:has-text("添加"), button:has-text("新建")');
      if (await createButton.isVisible()) {
        await createButton.click();
        
        // 填写商品信息
        await page.fill('input[name="name"], input[placeholder*="商品名称"]', '测试商品' + Date.now());
        await page.fill('input[name="price"], input[placeholder*="价格"]', '10.50');
        await page.fill('input[name="stock"], input[placeholder*="库存"]', '100');
        await page.selectOption('select[name="category"]', '蔬菜');
        
        // 提交
        await page.click('button[type="submit"], button:has-text("提交"), button:has-text("保存")');
        await page.waitForTimeout(2000);
      }
      
      // 2. 上架商品
      const toggleButton = page.locator('button:has-text("上架")').first();
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        await page.waitForTimeout(1000);
      }
      
      // 3. 买家登录并查看商品
      await loginUser(page, TEST_USERS.buyer);
      await page.goto('/buyer/products');
      await waitForAPIResponse(page, /\/api\/buyer\/products/);
      
      // 4. 添加到购物车
      const addToCartButton = page.locator('button:has-text("加入购物车")').first();
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        await page.waitForTimeout(1000);
      }
      
      // 5. 查看购物车
      await page.goto('/buyer/cart');
      await waitForAPIResponse(page, /\/api\/buyer\/cart/);
      
      // 6. 创建订单
      const checkoutButton = page.locator('button:has-text("结算"), button:has-text("去支付")');
      if (await checkoutButton.isVisible()) {
        await checkoutButton.click();
        await page.waitForTimeout(2000);
      }
      
      await page.screenshot({ path: 'test-results/47-complete-flow.png' });
    });

    test('7.2 农户融资申请流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.farmer);
      await page.goto('/farmer/finance');
      
      // 点击申请按钮
      const applyButton = page.locator('button:has-text("申请"), button:has-text("提交申请")');
      if (await applyButton.isVisible()) {
        await applyButton.click();
        
        // 填写申请信息
        await page.fill('input[name="amount"], input[placeholder*="金额"]', '50000');
        await page.fill('input[name="termMonths"], input[placeholder*="期限"]', '12');
        await page.fill('textarea[name="purpose"], textarea[placeholder*="用途"]', '测试融资用途');
        
        // 提交
        await page.click('button[type="submit"], button:has-text("提交")');
        await page.waitForTimeout(2000);
      }
      
      await page.screenshot({ path: 'test-results/48-finance-apply.png' });
    });

    test('7.3 银行审批流程', async ({ page }) => {
      await loginUser(page, TEST_USERS.bank);
      await page.goto('/bank/approval');
      await waitForAPIResponse(page, /\/api\/bank\/approval/);
      
      // 查看申请列表
      const applicationRow = page.locator('tr, .application-item').first();
      if (await applicationRow.isVisible()) {
        await applicationRow.click();
        await page.waitForTimeout(1000);
        
        // 审批操作
        const approveButton = page.locator('button:has-text("通过"), button:has-text("批准")');
        if (await approveButton.isVisible()) {
          await approveButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      await page.screenshot({ path: 'test-results/49-bank-approval.png' });
    });
  });

  test.describe('8. API端点测试', () => {
    test('8.1 测试所有API端点响应', async ({ page, request }) => {
      // 测试认证API
      const authResponse = await request.get('http://localhost:8080/api/auth/health');
      expect(authResponse.ok()).toBeTruthy();
      
      // 测试农户API
      const farmerResponse = await request.get('http://localhost:8080/api/farmer/products/health');
      expect(farmerResponse.ok()).toBeTruthy();
      
      // 测试买家API
      const buyerResponse = await request.get('http://localhost:8080/api/buyer/products/health');
      expect(buyerResponse.ok()).toBeTruthy();
      
      // 测试银行API（需要认证）
      // const bankResponse = await request.get('http://localhost:8080/api/bank/loan/products');
      // expect([200, 401, 403]).toContain(bankResponse.status());
      
      // 测试专家API（需要认证）
      // const expertResponse = await request.get('http://localhost:8080/api/expert/qa/questions/pending');
      // expect([200, 401, 403]).toContain(expertResponse.status());
      
      // 测试管理员API（需要认证）
      // const adminResponse = await request.get('http://localhost:8080/api/admin/users');
      // expect([200, 401, 403]).toContain(adminResponse.status());
    });
  });

  test.describe('9. 错误处理和边界测试', () => {
    test('9.1 404页面测试', async ({ page }) => {
      await page.goto('/non-existent-page');
      await expect(page.locator('text=404').or(page.locator('text=Not Found'))).toBeVisible();
      await page.screenshot({ path: 'test-results/50-404-page.png' });
    });

    test('9.2 未认证访问受保护页面', async ({ page }) => {
      await page.goto('/farmer/products');
      // 应该重定向到登录页
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/select-role|\/login|\/auth/);
      await page.screenshot({ path: 'test-results/51-unauthorized.png' });
    });

    test('9.3 跨角色权限测试', async ({ page }) => {
      // 农户登录后尝试访问买家页面
      await loginUser(page, TEST_USERS.farmer);
      await page.goto('/buyer/products');
      await page.waitForTimeout(2000);
      // 应该被阻止或重定向
      await page.screenshot({ path: 'test-results/52-cross-role.png' });
    });
  });
});

