#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runPerformanceTest() {
  console.log('🚀 开始性能测试...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // 设置视口
    await page.setViewport({ width: 1280, height: 720 });
    
    // 启用性能监控
    await page.setCacheEnabled(false);
    
    // 监听性能指标
    const performanceMetrics = {};
    
    page.on('metrics', data => {
      performanceMetrics.metrics = data;
    });

    // 监听控制台日志
    page.on('console', msg => {
      if (msg.text().includes('性能')) {
        console.log('📊 性能日志:', msg.text());
      }
    });

    // 导航到首页
    console.log('📄 加载首页...');
    const startTime = Date.now();
    
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;
    console.log(`⏱️  首页加载时间: ${loadTime}ms`);

    // 获取性能指标
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });

    console.log('📈 性能指标:');
    console.log(`  - DOM内容加载: ${performance.domContentLoaded}ms`);
    console.log(`  - 页面完全加载: ${performance.loadComplete}ms`);
    console.log(`  - 首次绘制: ${performance.firstPaint}ms`);
    console.log(`  - 首次内容绘制: ${performance.firstContentfulPaint}ms`);
    console.log(`  - 总加载时间: ${performance.totalTime}ms`);

    // 测试按钮响应
    console.log('🔘 测试按钮响应...');
    const buttonClickTime = await page.evaluate(() => {
      const button = document.querySelector('button');
      if (!button) return 0;
      
      const start = performance.now();
      button.click();
      return performance.now() - start;
    });

    console.log(`  - 按钮点击响应时间: ${buttonClickTime.toFixed(2)}ms`);

    // 测试图片加载
    console.log('🖼️  测试图片加载...');
    const imageLoadTime = await page.evaluate(() => {
      return new Promise(resolve => {
        const img = new Image();
        const start = performance.now();
        
        img.onload = () => {
          resolve(performance.now() - start);
        };
        
        img.onerror = () => {
          resolve(0);
        };
        
        img.src = '/icon-192x192.png';
      });
    });

    console.log(`  - 图片加载时间: ${imageLoadTime.toFixed(2)}ms`);

    // 生成性能报告
    const report = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3001',
      metrics: {
        pageLoadTime: loadTime,
        domContentLoaded: performance.domContentLoaded,
        loadComplete: performance.loadComplete,
        firstPaint: performance.firstPaint,
        firstContentfulPaint: performance.firstContentfulPaint,
        totalTime: performance.totalTime,
        buttonClickTime: buttonClickTime,
        imageLoadTime: imageLoadTime
      },
      recommendations: []
    };

    // 性能建议
    if (performance.firstContentfulPaint > 2000) {
      report.recommendations.push('首屏内容绘制时间过长，建议优化关键资源加载');
    }

    if (performance.totalTime > 5000) {
      report.recommendations.push('页面总加载时间过长，建议优化资源大小和网络请求');
    }

    if (buttonClickTime > 100) {
      report.recommendations.push('按钮响应时间过长，建议优化JavaScript执行');
    }

    if (imageLoadTime > 1000) {
      report.recommendations.push('图片加载时间过长，建议优化图片大小和格式');
    }

    // 保存报告
    const reportPath = path.join(__dirname, '../performance-report.json');
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
  } finally {
    await browser.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runPerformanceTest().catch(console.error);
}

module.exports = { runPerformanceTest }; 