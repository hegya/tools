/**
 * GitHub Actions 脚本 - 使用 Puppeteer 绕过 JS Challenge 定时抓取 RSS
 * 配合 .github/workflows/grab-rss.yml 使用
 */

import puppeteer from 'puppeteer';

const GRAB_URL = process.env.GRAB_URL;

async function main() {
  console.log(`[${new Date().toISOString()}] 开始抓取 RSS...`);
  
  let browser;
  try {
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // 设置 User-Agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('访问:', GRAB_URL);
    
    // 访问页面
    await page.goto(GRAB_URL, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    // 等待 JS Challenge 完成
    console.log('等待 JS Challenge...');
    await page.waitForFunction(
      () => {
        const body = document.body.innerText;
        return body.includes('"success"') || body.includes('"fetched"');
      },
      { timeout: 30000 }
    );

    // 获取结果
    const result = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('抓取结果:');
    console.log(result);

    // 解析 JSON
    const data = JSON.parse(result);
    
    if (data.success) {
      console.log(`✓ 成功: 抓取 ${data.fetched} 条，新增 ${data.saved} 条`);
      if (data.errors && data.errors.length > 0) {
        console.log('警告:', data.errors.join('; '));
      }
    } else {
      console.error('✗ 失败:', data.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('执行失败:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log(`[${new Date().toISOString()}] 完成`);
}

main();
