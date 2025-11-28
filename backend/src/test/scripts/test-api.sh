#!/bin/bash

# AgriVerse 后端API连通性测试脚本
# 使用方法: ./test-api.sh [base_url]
# 默认base_url: http://localhost:8080/api

BASE_URL=${1:-http://localhost:8080/api}
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "AgriVerse 后端API连通性测试"
echo "=========================================="
echo "测试服务器: $BASE_URL"
echo ""

# 测试计数器
PASSED=0
FAILED=0

# 测试函数
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local need_auth=${5:-false}
    local token=$6
    
    local url="$BASE_URL$endpoint"
    local headers="Content-Type: application/json"
    
    if [ "$need_auth" = "true" ] && [ -n "$token" ]; then
        headers="$headers\nAuthorization: Bearer $token"
    fi
    
    echo -n "测试: $description ... "
    
    if [ "$method" = "GET" ]; then
        if [ -n "$token" ] && [ "$need_auth" = "true" ]; then
            response=$(curl -s -w "\n%{http_code}" -X GET "$url" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token")
        else
            response=$(curl -s -w "\n%{http_code}" -X GET "$url" \
                -H "Content-Type: application/json")
        fi
    elif [ "$method" = "POST" ]; then
        if [ -n "$token" ] && [ "$need_auth" = "true" ]; then
            response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
                -H "Content-Type: application/json" \
                -d "$data")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ 通过 (HTTP $http_code)${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ 失败 (HTTP $http_code)${NC}"
        echo "  响应: $body"
        ((FAILED++))
        return 1
    fi
}

# 1. 健康检查
echo "----------------------------------------"
echo "1. 健康检查测试"
echo "----------------------------------------"
test_endpoint "GET" "/auth/health" "" "认证服务健康检查"
test_endpoint "GET" "/farmer/products/health" "" "农户商品服务健康检查"
echo ""

# 2. 用户注册测试
echo "----------------------------------------"
echo "2. 用户注册测试"
echo "----------------------------------------"
TIMESTAMP=$(date +%s)
TEST_PHONE="1380000${TIMESTAMP: -4}"
REGISTER_DATA="{\"phone\":\"$TEST_PHONE\",\"code\":\"123456\",\"password\":\"test123456\",\"role\":\"farmer\",\"name\":\"测试用户\"}"

test_endpoint "POST" "/auth/register" "$REGISTER_DATA" "用户注册"
echo ""

# 3. 用户登录测试
echo "----------------------------------------"
echo "3. 用户登录测试"
echo "----------------------------------------"
LOGIN_DATA="{\"phone\":\"$TEST_PHONE\",\"password\":\"test123456\",\"role\":\"farmer\"}"

echo -n "测试: 用户登录 ... "
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    echo -e "${GREEN}✓ 通过 (HTTP $HTTP_CODE)${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}  Token已获取${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}  警告: 未获取到Token${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ 失败 (HTTP $HTTP_CODE)${NC}"
    echo "  响应: $LOGIN_RESPONSE"
    TOKEN=""
    ((FAILED++))
fi
echo ""

# 4. 获取当前用户信息（需要认证）
echo "----------------------------------------"
echo "4. 认证接口测试"
echo "----------------------------------------"
if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/auth/me" "" "获取当前用户信息" "true" "$TOKEN"
else
    echo -e "${YELLOW}跳过: 需要Token，但登录失败${NC}"
    ((FAILED++))
fi
echo ""

# 5. 农户商品管理接口测试（需要认证）
echo "----------------------------------------"
echo "5. 农户商品管理接口测试"
echo "----------------------------------------"
if [ -n "$TOKEN" ]; then
    test_endpoint "GET" "/farmer/products/list" "" "获取商品列表" "true" "$TOKEN"
    test_endpoint "GET" "/farmer/products/list?status=on&page=1&pageSize=10" "" "获取已上架商品列表" "true" "$TOKEN"
    test_endpoint "GET" "/farmer/products/list?search=大米" "" "搜索商品" "true" "$TOKEN"
    test_endpoint "GET" "/farmer/products/dashboard" "" "获取商品数据看板" "true" "$TOKEN"
else
    echo -e "${YELLOW}跳过: 需要Token，但登录失败${NC}"
    ((FAILED++))
fi
echo ""

# 6. 测试未认证访问（应该返回401）
echo "----------------------------------------"
echo "6. 安全测试（未认证访问）"
echo "----------------------------------------"
echo -n "测试: 未认证访问受保护接口 ... "
UNAUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/farmer/products/list" \
    -H "Content-Type: application/json")

UNAUTH_HTTP_CODE=$(echo "$UNAUTH_RESPONSE" | tail -n1)

if [ "$UNAUTH_HTTP_CODE" -eq 401 ]; then
    echo -e "${GREEN}✓ 通过 (正确返回401未授权)${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ 失败 (HTTP $UNAUTH_HTTP_CODE，应该返回401)${NC}"
    ((FAILED++))
fi
echo ""

# 测试结果汇总
echo "=========================================="
echo "测试结果汇总"
echo "=========================================="
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${RED}失败: $FAILED${NC}"
TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
    echo "成功率: ${SUCCESS_RATE}%"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}所有测试通过！✓${NC}"
    exit 0
else
    echo -e "${RED}部分测试失败，请检查后端服务${NC}"
    exit 1
fi

