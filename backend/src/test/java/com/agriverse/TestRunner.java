package com.agriverse;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

/**
 * 测试运行器
 * 运行所有测试套件
 */
@Suite
@SuiteDisplayName("AgriVerse 完整测试套件")
@SelectPackages({
    "com.agriverse.auth",
    "com.agriverse.farmer",
    "com.agriverse.buyer",
    "com.agriverse.bank",
    "com.agriverse.expert",
    "com.agriverse.admin",
    "com.agriverse.integration"
})
public class TestRunner {
    // 测试套件运行器
}

