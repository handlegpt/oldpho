#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

async function runSimplePerformanceTest() {
  console.log('🚀 开始简化性能测试...');
  
  const testUrl = 'http://localhost:3001';
  
  try {
    // 测试服务器响应时间
    console.log('📡 测试服务器响应时间...');
    const responseTime = await measureResponseTime(testUrl);
    console.log(`⏱️  服务器响应时间: ${responseTime}ms`);

    // 测试页面大小
    console.log('📄 测试页面大小...');
    const pageSize = await getPageSize(testUrl);
    console.log(`📊 页面大小: ${pageSize} bytes`);

    // 生成性能报告
    const report = {
      timestamp: new Date().toISOString(),
      url: testUrl,
      metrics: {
        responseTime: responseTime,
        pageSize: pageSize
      },
      recommendations: []
    };

    // 性能建议
    if (responseTime > 1000) {
      report.recommendations.push('服务器响应时间过长，建议优化数据库查询和缓存');
    }

    if (pageSize > 500000) {
      report.recommendations.push('页面大小过大，建议优化资源压缩和懒加载');
    }

    // 保存报告
    const reportPath = path.join(__dirname, '../performance-report-simple.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📋 性能报告已保存到:', reportPath);
    
    if (report.recommendations.length > 0) {
      console.log('💡 优化建议:');
      report.recommendations.forEach(rec => console.log(`  - ${rec}`));
    } else {
      console.log('✅ 性能表现良好！');
    }

  } catch (error) {
    console.error('❌ 性能测试失败:', error);
  }
}

function measureResponseTime(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.get(url, (res) => {
      const endTime = Date.now();
      resolve(endTime - startTime);
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

function getPageSize(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(Buffer.byteLength(data, 'utf8'));
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 如果直接运行此脚本
if (require.main === module) {
  runSimplePerformanceTest().catch(console.error);
}

module.exports = { runSimplePerformanceTest }; 